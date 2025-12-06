// Test script to verify all API endpoints and functionality
const tests = {
  stats: false,
  clients: false,
  tasks: false,
  transactions: false,
  createClient: false,
  createTask: false,
  createTransaction: false,
};

async function runTests() {
  console.log("🧪 Starting system tests...\n");

  try {
    // Test 1: Stats API
    console.log("1️⃣ Testing Stats API...");
    const statsRes = await fetch("http://localhost:3000/api/stats");
    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log("✅ Stats:", stats);
      tests.stats = true;
    } else {
      console.log("❌ Stats failed:", statsRes.status);
    }

    // Test 2: Clients API
    console.log("\n2️⃣ Testing Clients API...");
    const clientsRes = await fetch("http://localhost:3000/api/clients");
    if (clientsRes.ok) {
      const clients = await clientsRes.json();
      console.log(`✅ Clients: ${clients.length} found`);
      tests.clients = true;
    } else {
      console.log("❌ Clients failed:", clientsRes.status);
    }

    // Test 3: Tasks API
    console.log("\n3️⃣ Testing Tasks API...");
    const tasksRes = await fetch("http://localhost:3000/api/tasks");
    if (tasksRes.ok) {
      const tasks = await tasksRes.json();
      console.log(`✅ Tasks: ${tasks.length} found`);
      tests.tasks = true;
    } else {
      console.log("❌ Tasks failed:", tasksRes.status);
    }

    // Test 4: Transactions API
    console.log("\n4️⃣ Testing Transactions API...");
    const transRes = await fetch("http://localhost:3000/api/transactions");
    if (transRes.ok) {
      const transactions = await transRes.json();
      console.log(`✅ Transactions: ${transactions.length} found`);
      tests.transactions = true;
    } else {
      console.log("❌ Transactions failed:", transRes.status);
    }

    // Summary
    console.log("\n📊 Test Summary:");
    console.log("=".repeat(50));
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`${passed ? "✅" : "❌"} ${test}`);
    });
    
    const passedCount = Object.values(tests).filter(Boolean).length;
    const totalCount = Object.keys(tests).length;
    console.log(`\n${passedCount}/${totalCount} tests passed`);
    
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

runTests();
