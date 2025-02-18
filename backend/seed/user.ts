import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('1234', 10);

  await prisma.user.upsert({
    where: { phone: '998901234567' },
    update: {},
    create: {
      fullName: 'Super Admin',
      password: hashedPassword,
      phone: '998901234567',
      avatar: null,
      bio: 'This is the superadmin account',
      dateOfBirth: new Date('1990-01-01'),
      role: 'superadmin',
      status: 'ACTIVE',
      lastLoginAt: null,
      regionId: null,
      districtId: null,
    },
  });

  console.log('✅ Superadmin created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
