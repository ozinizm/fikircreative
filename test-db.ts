import prisma from "./lib/prisma";

async function testDatabase() {
  console.log("🔍 Testing database...\n");

  try {
    // Test users
    const users = await prisma.user.findMany();
    console.log(`✅ Users: ${users.length} found`);
    users.forEach((u) => console.log(`   - ${u.name} (${u.email}) - ${u.role}`));

    // Test clients
    const clients = await prisma.client.findMany();
    console.log(`\n✅ Clients: ${clients.length} found`);
    clients.forEach((c) => console.log(`   - ${c.name} (${c.status})`));

    // Test projects
    const projects = await prisma.project.findMany();
    console.log(`\n✅ Projects: ${projects.length} found`);
    projects.forEach((p) => console.log(`   - ${p.title} (${p.status})`));

    // Test tasks
    const tasks = await prisma.task.findMany();
    console.log(`\n✅ Tasks: ${tasks.length} found`);
    tasks.forEach((t) => console.log(`   - ${t.title} (${t.status})`));

    // Test transactions
    const transactions = await prisma.transaction.findMany();
    console.log(`\n✅ Transactions: ${transactions.length} found`);
    transactions.forEach((t) =>
      console.log(`   - ${t.title}: ${t.type} ₺${t.amount}`)
    );

    // Test equipment
    const equipment = await prisma.equipment.findMany();
    console.log(`\n✅ Equipment: ${equipment.length} found`);

    // Test events
    const events = await prisma.event.findMany();
    console.log(`\n✅ Events: ${events.length} found`);

    console.log("\n🎉 Database test completed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
