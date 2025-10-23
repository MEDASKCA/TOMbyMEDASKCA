import { NextResponse } from 'next/server';
import { seedAllData } from '@/lib/firebase/seed';

// Static export configuration for GitHub Pages, dynamic for Vercel
export const dynamic = process.env.GITHUB_ACTIONS === 'true' ? 'force-static' : 'force-dynamic';

/**
 * API endpoint to seed the database
 * POST /api/seed
 */
export async function POST() {
  try {
    console.log('API: Starting seed process...');
    await seedAllData();

    return NextResponse.json({
      success: true,
      message: 'Core data seeded successfully. Import instruments from Synergy Trak at /admin/import-instruments',
      data: {
        staff: 925,
        theatres: 20,
        note: 'Instrument trays should be imported from Synergy Trak'
      }
    });
  } catch (error) {
    console.error('API: Seed error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint returns seed status/info
 */
export async function GET() {
  return NextResponse.json({
    message: 'TOM Database Seeding Endpoint',
    usage: 'Send a POST request to this endpoint to seed core data (staff & theatres)',
    data: {
      staff: 925,
      theatres: 20,
      note: 'For instruments: Use /admin/import-instruments to import from Synergy Trak'
    }
  });
}
