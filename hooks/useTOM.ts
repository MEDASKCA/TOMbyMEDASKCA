import { where, orderBy } from 'firebase/firestore';
import { useFirestoreCollection } from './useFirestore';
import {
  StaffMember,
  StaffBreak,
  ReliefRequest,
  SickLeave,
  LateArrival,
  VacantShift,
  Theatre,
  Procedure,
  TheatreEfficiency,
  COLLECTIONS
} from '@/types/tom';

// ===== STAFF HOOKS =====
export function useAllStaff() {
  return useFirestoreCollection<StaffMember>(COLLECTIONS.STAFF);
}

export function useStaffByDepartment(department: string) {
  return useFirestoreCollection<StaffMember>(
    COLLECTIONS.STAFF,
    [where('department', '==', department)]
  );
}

export function useStaffOnDuty() {
  return useFirestoreCollection<StaffMember>(
    COLLECTIONS.STAFF,
    [where('shiftStart', '!=', null)]
  );
}

// ===== BREAK HOOKS =====
export function useBreaksForDate(date: string) {
  return useFirestoreCollection<StaffBreak>(
    COLLECTIONS.STAFF_BREAKS,
    [where('date', '==', date), orderBy('startTime')]
  );
}

export function useBreaksForStaff(staffId: string, date: string) {
  return useFirestoreCollection<StaffBreak>(
    COLLECTIONS.STAFF_BREAKS,
    [where('staffId', '==', staffId), where('date', '==', date)]
  );
}

// ===== RELIEF REQUEST HOOKS =====
export function useActiveReliefRequests() {
  return useFirestoreCollection<ReliefRequest>(
    COLLECTIONS.RELIEF_REQUESTS,
    [
      where('status', 'in', ['pending', 'acknowledged']),
      orderBy('requestedAt', 'desc')
    ]
  );
}

export function useAllReliefRequests() {
  return useFirestoreCollection<ReliefRequest>(
    COLLECTIONS.RELIEF_REQUESTS,
    [orderBy('requestedAt', 'desc')]
  );
}

// ===== SICK LEAVE HOOKS =====
export function useActiveSickLeave() {
  return useFirestoreCollection<SickLeave>(
    COLLECTIONS.SICK_LEAVE,
    [where('status', '==', 'active'), orderBy('startDate')]
  );
}

export function useSickLeaveHistory() {
  return useFirestoreCollection<SickLeave>(
    COLLECTIONS.SICK_LEAVE,
    [orderBy('startDate', 'desc')]
  );
}

// ===== LATE ARRIVAL HOOKS =====
export function useLateArrivalsForDate(date: string) {
  return useFirestoreCollection<LateArrival>(
    COLLECTIONS.LATE_ARRIVALS,
    [where('date', '==', date), orderBy('scheduledStart')]
  );
}

// ===== VACANT SHIFT HOOKS =====
export function useVacantShifts(startDate: string, endDate: string) {
  return useFirestoreCollection<VacantShift>(
    COLLECTIONS.VACANT_SHIFTS,
    [
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      where('status', '==', 'open'),
      orderBy('date'),
      orderBy('priority')
    ]
  );
}

// ===== THEATRE HOOKS =====
export function useAllTheatres() {
  return useFirestoreCollection<Theatre>(COLLECTIONS.THEATRES);
}

export function useActiveTheatres() {
  return useFirestoreCollection<Theatre>(
    COLLECTIONS.THEATRES,
    [where('status', '==', 'active')]
  );
}

export function useTheatresByType(type: Theatre['type']) {
  return useFirestoreCollection<Theatre>(
    COLLECTIONS.THEATRES,
    [where('type', '==', type)]
  );
}

// ===== PROCEDURE HOOKS =====
export function useProceduresForDate(date: string) {
  return useFirestoreCollection<Procedure>(
    COLLECTIONS.PROCEDURES,
    [where('date', '==', date), orderBy('scheduledTime')]
  );
}

export function useProceduresForTheatre(theatreId: string, date: string) {
  return useFirestoreCollection<Procedure>(
    COLLECTIONS.PROCEDURES,
    [
      where('theatreId', '==', theatreId),
      where('date', '==', date),
      orderBy('scheduledTime')
    ]
  );
}

export function useActiveProcedures() {
  return useFirestoreCollection<Procedure>(
    COLLECTIONS.PROCEDURES,
    [where('status', 'in', ['in_theatre', 'anaesthetic', 'surgery', 'recovery'])]
  );
}

// ===== EFFICIENCY HOOKS =====
export function useEfficiencyForDate(date: string) {
  return useFirestoreCollection<TheatreEfficiency>(
    COLLECTIONS.THEATRE_EFFICIENCY,
    [where('date', '==', date), orderBy('efficiencyScore', 'desc')]
  );
}

export function useEfficiencyForTheatre(theatreId: string, date: string) {
  return useFirestoreCollection<TheatreEfficiency>(
    COLLECTIONS.THEATRE_EFFICIENCY,
    [where('theatreId', '==', theatreId), where('date', '==', date)]
  );
}

// ===== COMBINED DASHBOARD HOOK =====
export function useDashboardData(date: string) {
  const { data: procedures, loading: proceduresLoading } = useProceduresForDate(date);
  const { data: reliefRequests, loading: reliefLoading } = useActiveReliefRequests();
  const { data: sickLeave, loading: sickLoading } = useActiveSickLeave();
  const { data: staffOnDuty, loading: staffLoading } = useStaffOnDuty();
  const { data: theatres, loading: theatresLoading } = useActiveTheatres();
  const { data: efficiency, loading: efficiencyLoading } = useEfficiencyForDate(date);

  const loading =
    proceduresLoading ||
    reliefLoading ||
    sickLoading ||
    staffLoading ||
    theatresLoading ||
    efficiencyLoading;

  return {
    procedures,
    reliefRequests,
    sickLeave,
    staffOnDuty,
    theatres,
    efficiency,
    loading,
  };
}
