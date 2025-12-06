import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      auth0Id: 'auth0|test1',
      email: 'test1@example.com',
      username: 'reefmaster',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Reef aquarium enthusiast for 10+ years',
      location: 'Miami, FL',
      emailVerified: true,
      subscriptionTier: 'free',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {},
    create: {
      auth0Id: 'auth0|test2',
      email: 'test2@example.com',
      username: 'coralkeeper',
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Marine biologist and coral enthusiast',
      location: 'San Diego, CA',
      emailVerified: true,
      subscriptionTier: 'free',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'test3@example.com' },
    update: {},
    create: {
      auth0Id: 'auth0|test3',
      email: 'test3@example.com',
      username: 'tankbuilder',
      firstName: 'Mike',
      lastName: 'Johnson',
      bio: 'Custom reef tank builder',
      location: 'Austin, TX',
      emailVerified: true,
      subscriptionTier: 'free',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
  });

  console.log('✅ Created users:', { user1, user2, user3 });

  // Create test tanks
  const tank1 = await prisma.tank.create({
    data: {
      name: 'Main Display Reef',
      size: 120,
      type: 'reef',
      description: 'Large mixed reef with SPS and LPS corals',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      userId: user1.id,
    },
  });

  const tank2 = await prisma.tank.create({
    data: {
      name: 'Nano Reef',
      size: 25,
      type: 'reef',
      description: 'Small office nano reef with softies',
      imageUrl: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800',
      userId: user1.id,
    },
  });

  const tank3 = await prisma.tank.create({
    data: {
      name: 'Research Tank',
      size: 75,
      type: 'reef',
      description: 'Coral propagation and research setup',
      imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800',
      userId: user2.id,
    },
  });

  const tank4 = await prisma.tank.create({
    data: {
      name: 'Custom Peninsula Tank',
      size: 200,
      type: 'reef',
      description: 'Custom built peninsula display tank',
      imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',
      userId: user3.id,
    },
  });

  console.log('✅ Created tanks:', { tank1, tank2, tank3, tank4 });

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
