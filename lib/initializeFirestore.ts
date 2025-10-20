import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function initializeDefaultTeams() {
  const teams = [
    {
      id: 'team1',
      name: 'Engineering Team',
      description: 'Engineering and development discussions',
      channels: [
        { id: 'general', name: 'General', description: 'General team discussions', isPrivate: false },
        { id: 'development', name: 'Development', description: 'Development topics', isPrivate: false },
        { id: 'bugs', name: 'Bug Reports', description: 'Report and track bugs', isPrivate: false },
        { id: 'private', name: 'Private Channel', description: 'Private discussions', isPrivate: true },
      ],
    },
    {
      id: 'team2',
      name: 'Marketing',
      description: 'Marketing and campaigns',
      channels: [
        { id: 'general', name: 'General', description: 'General marketing discussions', isPrivate: false },
        { id: 'campaigns', name: 'Campaigns', description: 'Campaign planning', isPrivate: false },
      ],
    },
  ];

  try {
    for (const team of teams) {
      const teamRef = doc(db, 'teams', team.id);

      // Check if team already exists
      const teamDoc = await getDoc(teamRef);
      if (!teamDoc.exists()) {
        // Create team
        await setDoc(teamRef, {
          name: team.name,
          description: team.description,
          createdAt: new Date(),
        });

        // Create channels
        for (const channel of team.channels) {
          const channelRef = doc(db, 'teams', team.id, 'channels', channel.id);
          await setDoc(channelRef, {
            name: channel.name,
            description: channel.description,
            isPrivate: channel.isPrivate,
            createdAt: new Date(),
          });
        }

        console.log(`Created team: ${team.name}`);
      }
    }
    console.log('Firestore initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
}
