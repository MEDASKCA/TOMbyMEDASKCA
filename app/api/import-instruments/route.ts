import { NextRequest, NextResponse } from 'next/server';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS, InventoryItem } from '@/types/tom';

// Static export configuration for GitHub Pages, dynamic for Vercel
export const dynamic = process.env.GITHUB_ACTIONS === 'true' ? 'force-static' : 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { instruments } = await request.json();

    if (!instruments || !Array.isArray(instruments) || instruments.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No instruments data provided' },
        { status: 400 }
      );
    }

    console.log(`Importing ${instruments.length} instrument trays...`);

    const batch = writeBatch(db);
    let count = 0;
    const batchSize = 500; // Firestore batch limit

    for (const item of instruments) {
      const inventoryRef = doc(collection(db, COLLECTIONS.INVENTORY));

      // Normalize field names (handle both camelCase and Title Case from CSV)
      const name = item.name || item['Tray Name'] || item.Name || `Instrument Tray ${count + 1}`;
      const specialty = item.specialty || item.Specialty || 'General';
      const location = item.location || item.Location || 'Sterile Services';
      const quantity = parseInt(item.quantity || item.Quantity || '1', 10);
      const status = item.status || item.Status || 'available';
      const notes = item.notes || item.Notes || '';

      const inventoryItem: Omit<InventoryItem, 'id'> = {
        name,
        category: 'Instrument Tray',
        specialty,
        location,
        quantity,
        minQuantity: 1,
        status: status as InventoryItem['status'],
        notes,
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add instruments if provided
      if (item.instruments && Array.isArray(item.instruments)) {
        (inventoryItem as any).instruments = item.instruments;
      }

      batch.set(inventoryRef, inventoryItem);
      count++;

      // Commit batch when reaching limit
      if (count % batchSize === 0) {
        await batch.commit();
        console.log(`  ✅ Committed ${count} trays`);
      }
    }

    // Commit remaining
    if (count % batchSize !== 0) {
      await batch.commit();
    }

    console.log(`✅ Successfully imported ${count} instrument trays`);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${count} instrument trays`,
      count
    });
  } catch (error) {
    console.error('Import error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Instrument Import Endpoint',
    usage: 'POST instrument data to this endpoint',
    expectedFormat: {
      instruments: [
        {
          name: 'Tray name',
          specialty: 'Orthopaedic',
          location: 'Sterile Services',
          quantity: 2,
          status: 'available',
          notes: 'Optional notes',
          instruments: [
            { name: 'Instrument name', quantity: 1 }
          ]
        }
      ]
    }
  });
}
