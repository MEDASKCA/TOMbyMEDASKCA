/**
 * TOM Database Seeding Script
 *
 * Run this script to populate your Firestore database with mock data
 *
 * Usage:
 *   npx tsx scripts/seed-database.ts
 *
 * Or use the web interface:
 *   http://localhost:3000/admin/seed
 */

import { seedAllData } from '../lib/firebase/seed';

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   TOM Database Seeding Script          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');

  try {
    await seedAllData();
    console.log('');
    console.log('✅ Seeding completed successfully!');
    console.log('');
    console.log('You can now:');
    console.log('  • View data in Firebase Console');
    console.log('  • Use TOM hooks in your components');
    console.log('  • Navigate to http://localhost:3000/modern');
    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Seeding failed:');
    console.error(error);
    console.error('');
    process.exit(1);
  }
}

main();
