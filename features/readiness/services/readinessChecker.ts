import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Theatre, Case, Staff, InventoryItem, ProcedureCard, ReadinessCheck, ReadinessLevel, Shift } from '@/types';

export async function checkTheatreReadiness(
  theatreId: string,
  caseId?: string
): Promise<ReadinessCheck> {
  // Get theatre
  const theatreDoc = await getDocs(query(collection(db, 'theatres'), where('__name__', '==', theatreId)));
  if (theatreDoc.empty) {
    throw new Error('Theatre not found');
  }
  const theatre = { id: theatreDoc.docs[0].id, ...theatreDoc.docs[0].data() } as Theatre;

  // Get next case or specified case
  let targetCase: Case | null = null;
  if (caseId) {
    const caseDoc = await getDocs(query(collection(db, 'cases'), where('__name__', '==', caseId)));
    if (!caseDoc.empty) {
      targetCase = { id: caseDoc.docs[0].id, ...caseDoc.docs[0].data() } as Case;
    }
  } else if (theatre.nextCase) {
    const caseDoc = await getDocs(query(collection(db, 'cases'), where('__name__', '==', theatre.nextCase)));
    if (!caseDoc.empty) {
      targetCase = { id: caseDoc.docs[0].id, ...caseDoc.docs[0].data() } as Case;
    }
  }

  if (!targetCase) {
    // No case to check - theatre available
    return {
      theatreId,
      caseId: '',
      timestamp: new Date(),
      overall: 'ready',
      checks: [
        {
          category: 'staffing',
          status: 'ready',
          items: [{ name: 'No case scheduled', required: false, actual: true, status: 'ready' }],
        },
      ],
    };
  }

  // Get procedure requirements
  const procedureDoc = await getDocs(query(collection(db, 'procedures'), where('__name__', '==', targetCase.procedureId)));
  const procedure = procedureDoc.empty ? null : ({ id: procedureDoc.docs[0].id, ...procedureDoc.docs[0].data() } as ProcedureCard);

  if (!procedure) {
    return {
      theatreId,
      caseId: targetCase.id,
      timestamp: new Date(),
      overall: 'warning',
      checks: [
        {
          category: 'staffing',
          status: 'warning',
          items: [{ name: 'Procedure card not found', required: true, actual: false, status: 'not-ready' }],
        },
      ],
    };
  }

  // Check staffing
  const staffingCheck = await checkStaffing(targetCase, procedure);

  // Check equipment
  const equipmentCheck = await checkEquipment(procedure);

  // Check consumables
  const consumablesCheck = await checkConsumables(procedure);

  // Check environment
  const environmentCheck = checkEnvironment(theatre, procedure);

  // Overall status
  const allChecks = [staffingCheck, equipmentCheck, consumablesCheck, environmentCheck];
  const overall: ReadinessLevel =
    allChecks.every((c) => c.status === 'ready')
      ? 'ready'
      : allChecks.some((c) => c.status === 'not-ready')
      ? 'not-ready'
      : 'warning';

  return {
    theatreId,
    caseId: targetCase.id,
    timestamp: new Date(),
    overall,
    checks: allChecks,
  };
}

async function checkStaffing(targetCase: Case, procedure: ProcedureCard) {
  const today = new Date().toISOString().split('T')[0];

  // Get today's shifts
  const shiftsSnapshot = await getDocs(query(collection(db, 'shifts'), where('date', '==', today)));
  const shifts: Shift[] = [];
  shiftsSnapshot.forEach((doc) => {
    shifts.push({ id: doc.id, ...doc.data() } as Shift);
  });

  // Get staff details for assigned team
  const staffSnapshot = await getDocs(collection(db, 'staff'));
  const allStaff: Staff[] = [];
  staffSnapshot.forEach((doc) => {
    allStaff.push({ id: doc.id, ...doc.data() } as Staff);
  });

  const items: {
    name: string;
    required: boolean | number;
    actual: boolean | number;
    status: ReadinessLevel;
    notes?: string;
  }[] = [];

  for (const requirement of procedure.requiredStaff) {
    const assignedStaff = targetCase.teamIds
      .map((id) => allStaff.find((s) => s.id === id))
      .filter((s) => s && s.role === requirement.role);

    const requiredCount = requirement.count;
    const actualCount = assignedStaff.length;

    const hasShifts = assignedStaff.every((staff) =>
      shifts.some((shift) => shift.staffId === staff!.id && shift.status === 'confirmed')
    );

    let status: ReadinessLevel = 'ready';
    let notes: string | undefined;

    if (actualCount < requiredCount) {
      status = 'not-ready';
      notes = `Missing ${requiredCount - actualCount} ${requirement.role}(s)`;
    } else if (!hasShifts) {
      status = 'warning';
      notes = 'Staff assigned but shift not confirmed';
    }

    // Check competency if required
    if (requirement.requiredCompetency && assignedStaff.length > 0) {
      const competent = assignedStaff.some((staff) =>
        staff!.competencies.some(
          (comp) =>
            comp.procedureName === procedure.name &&
            (comp.level === 'competent' || comp.level === 'expert')
        )
      );
      if (!competent) {
        status = 'warning';
        notes = (notes ? notes + '; ' : '') + 'Check competency level';
      }
    }

    items.push({
      name: `${requirement.role} (${requirement.grade || 'any grade'})`,
      required: requiredCount,
      actual: actualCount,
      status,
      notes,
    });
  }

  const categoryStatus: ReadinessLevel = items.every((i) => i.status === 'ready')
    ? 'ready'
    : items.some((i) => i.status === 'not-ready')
    ? 'not-ready'
    : 'warning';

  return {
    category: 'staffing' as const,
    status: categoryStatus,
    items,
  };
}

async function checkEquipment(procedure: ProcedureCard) {
  const inventorySnapshot = await getDocs(collection(db, 'inventory'));
  const inventory: InventoryItem[] = [];
  inventorySnapshot.forEach((doc) => {
    inventory.push({ id: doc.id, ...doc.data() } as InventoryItem);
  });

  const items: {
    name: string;
    required: boolean | number;
    actual: boolean | number;
    status: ReadinessLevel;
    notes?: string;
  }[] = [];

  for (const requirement of procedure.requiredEquipment) {
    const item = inventory.find((inv) => inv.name === requirement.itemName);

    let status: ReadinessLevel = 'ready';
    let notes: string | undefined;

    if (!item) {
      status = requirement.isCritical ? 'not-ready' : 'warning';
      notes = 'Item not in inventory';
    } else if (item.quantity < requirement.quantity) {
      status = requirement.isCritical ? 'not-ready' : 'warning';
      notes = `Only ${item.quantity} available, need ${requirement.quantity}`;
    }

    items.push({
      name: requirement.itemName,
      required: requirement.quantity,
      actual: item?.quantity || 0,
      status,
      notes,
    });
  }

  const categoryStatus: ReadinessLevel = items.every((i) => i.status === 'ready')
    ? 'ready'
    : items.some((i) => i.status === 'not-ready')
    ? 'not-ready'
    : 'warning';

  return {
    category: 'equipment' as const,
    status: categoryStatus,
    items,
  };
}

async function checkConsumables(procedure: ProcedureCard) {
  const inventorySnapshot = await getDocs(collection(db, 'inventory'));
  const inventory: InventoryItem[] = [];
  inventorySnapshot.forEach((doc) => {
    inventory.push({ id: doc.id, ...doc.data() } as InventoryItem);
  });

  const items: {
    name: string;
    required: boolean | number;
    actual: boolean | number;
    status: ReadinessLevel;
    notes?: string;
  }[] = [];

  for (const requirement of procedure.requiredConsumables) {
    const item = inventory.find((inv) => inv.name.includes(requirement.itemName) || requirement.itemName.includes(inv.name));

    let status: ReadinessLevel = 'ready';
    let notes: string | undefined;

    if (!item) {
      status = requirement.isCritical ? 'not-ready' : 'warning';
      notes = 'Item not found in stock';
    } else if (item.quantity < requirement.quantity) {
      status = requirement.isCritical ? 'not-ready' : 'warning';
      notes = `Low stock: ${item.quantity} available`;
    }

    items.push({
      name: requirement.itemName,
      required: requirement.quantity,
      actual: item?.quantity || 0,
      status,
      notes,
    });
  }

  const categoryStatus: ReadinessLevel = items.every((i) => i.status === 'ready')
    ? 'ready'
    : items.some((i) => i.status === 'not-ready')
    ? 'not-ready'
    : 'warning';

  return {
    category: 'consumables' as const,
    status: categoryStatus,
    items,
  };
}

function checkEnvironment(theatre: Theatre, procedure: ProcedureCard) {
  const items: {
    name: string;
    required: boolean | number;
    actual: boolean | number;
    status: ReadinessLevel;
    notes?: string;
  }[] = [];

  // Check theatre status
  items.push({
    name: 'Theatre Status',
    required: true,
    actual: theatre.status === 'ready' || theatre.status === 'cleaning',
    status:
      theatre.status === 'ready'
        ? 'ready'
        : theatre.status === 'cleaning'
        ? 'warning'
        : 'not-ready',
    notes: theatre.status === 'ready' ? undefined : `Currently: ${theatre.status}`,
  });

  // Check special requirements
  for (const requirement of procedure.specialRequirements || []) {
    if (requirement.toLowerCase().includes('laminar')) {
      items.push({
        name: 'Laminar Flow',
        required: true,
        actual: theatre.features?.includes('laminar-flow') || false,
        status: theatre.features?.includes('laminar-flow') ? 'ready' : 'not-ready',
      });
    }
    if (requirement.toLowerCase().includes('imaging') || requirement.toLowerCase().includes('c-arm')) {
      items.push({
        name: 'Imaging Capability',
        required: true,
        actual: theatre.features?.includes('imaging-capable') || false,
        status: theatre.features?.includes('imaging-capable') ? 'ready' : 'warning',
      });
    }
  }

  const categoryStatus: ReadinessLevel = items.every((i) => i.status === 'ready')
    ? 'ready'
    : items.some((i) => i.status === 'not-ready')
    ? 'not-ready'
    : 'warning';

  return {
    category: 'environment' as const,
    status: categoryStatus,
    items,
  };
}
