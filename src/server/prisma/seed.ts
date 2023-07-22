/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import prisma from '../lib/prisma'

async function main() {
  await prisma.user.create({
    data: {
      name: 'User Alpha',
    },
  })

  await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'This is an example post generated from `prisma/seed.ts`',
      userId: 1,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
