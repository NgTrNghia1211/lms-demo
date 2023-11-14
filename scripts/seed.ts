const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Computer Science'},
        { name: 'Data Structure and Algorithms'},
        { name: 'Computer Systems'},
        { name: 'Software Development'},
        { name: 'Web Development'},
        { name: 'AI Beginners'},
      ]
    })

    console.log('Success seeding category');
  } catch (error) {
    console.log(`Error seeding category: `, error);
  } finally {
    await database.$disconnect();
  }
}

main();