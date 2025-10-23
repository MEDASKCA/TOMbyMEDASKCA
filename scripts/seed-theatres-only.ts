import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { COLLECTIONS, Theatre } from '../types/tom';
import locationsData from '../data/seed/locations.json';

const randomPastDate = () => {
  const now = Date.now();
  const yearAgo = now - 365 * 24 * 60 * 60 * 1000;
  return new Date(yearAgo + Math.random() * (now - yearAgo));
};

async function seedTheatresOnly() {
  console.log('🔄 Seeding theatres only...');

  const theatreLocations = locationsData.locations.filter(
    loc => loc.includes('Theatre') && !loc.includes('Recovery')
  );

  const batch = writeBatch(db);

  for (const location of theatreLocations) {
    const theatreRef = doc(collection(db, COLLECTIONS.THEATRES));

    let type: Theatre['type'] = 'general';
    if (location.includes('Main Theatre')) type = 'main';
    if (location.includes('DSU Theatre')) type = 'day_surgery';
    if (location.includes('Paediatric')) type = 'paediatric';

    const theatre: Omit<Theatre, 'id'> = {
      name: location,
      type,
      status: 'active',
      currentProcedure: null,
      scheduledProcedures: [],
      staff: [],
      equipment: [],
      createdAt: randomPastDate(),
      updatedAt: new Date()
    };

    batch.set(theatreRef, theatre);
  }

  await batch.commit();
  console.log(`✅ Seeded ${theatreLocations.length} theatres`);
}

seedTheatresOnly()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
