import { db } from './index';
import { sports, SPORTS_DATA, teams } from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.local') });

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed sports
    console.log('📊 Seeding sports...');
    for (const sport of SPORTS_DATA) {
      await db.insert(sports).values(sport).onConflictDoNothing();
    }
    console.log('✅ Sports seeded successfully');

    // Seed some example teams for each sport
    console.log('👥 Seeding teams...');
    const sportsData = await db.select().from(sports);
    
    const teamData = [
      // F1 Teams
      { sportId: sportsData.find(s => s.slug === 'f1')?.id, name: 'Red Bull Racing', shortName: 'RBR', primaryColor: '#1e41ff', secondaryColor: '#ff1e00' },
      { sportId: sportsData.find(s => s.slug === 'f1')?.id, name: 'Mercedes-AMG', shortName: 'MER', primaryColor: '#00d2be', secondaryColor: '#c6c6c6' },
      { sportId: sportsData.find(s => s.slug === 'f1')?.id, name: 'Ferrari', shortName: 'FER', primaryColor: '#dc0000', secondaryColor: '#fff000' },
      { sportId: sportsData.find(s => s.slug === 'f1')?.id, name: 'McLaren', shortName: 'MCL', primaryColor: '#ff8700', secondaryColor: '#47c7fc' },
      
      // MotoGP Teams
      { sportId: sportsData.find(s => s.slug === 'motogp')?.id, name: 'Ducati Lenovo Team', shortName: 'DUC', primaryColor: '#cc0000', secondaryColor: '#ffffff' },
      { sportId: sportsData.find(s => s.slug === 'motogp')?.id, name: 'Monster Energy Yamaha', shortName: 'YAM', primaryColor: '#0033a0', secondaryColor: '#00ff00' },
      { sportId: sportsData.find(s => s.slug === 'motogp')?.id, name: 'Repsol Honda Team', shortName: 'HON', primaryColor: '#ff6600', secondaryColor: '#004cff' },
      
      // Football Teams
      { sportId: sportsData.find(s => s.slug === 'football')?.id, name: 'Manchester United', shortName: 'MUN', country: 'England', primaryColor: '#da020e', secondaryColor: '#ffe500' },
      { sportId: sportsData.find(s => s.slug === 'football')?.id, name: 'Real Madrid', shortName: 'RMA', country: 'Spain', primaryColor: '#ffffff', secondaryColor: '#febe10' },
      { sportId: sportsData.find(s => s.slug === 'football')?.id, name: 'Bayern Munich', shortName: 'BAY', country: 'Germany', primaryColor: '#dc052d', secondaryColor: '#0066b2' },
    ].filter(team => team.sportId !== undefined);

    for (const team of teamData) {
      if (team.sportId) {
        await db.insert(teams).values({
          ...team,
          sportId: team.sportId,
        }).onConflictDoNothing();
      }
    }
    console.log('✅ Teams seeded successfully');

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();