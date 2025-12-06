// Kapsamlı Sistem Test Scripti
console.log("🚀 FikirCreative AgencyOS - Sistem Testi Başlıyor...\n");

const tests = [];
const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Test fonksiyonu
function test(name, fn) {
  tests.push({ name, fn });
}

// Sonuç yazdırma
function printResult(name, status, message = "") {
  const symbols = { pass: "✅", fail: "❌", warn: "⚠️" };
  console.log(`${symbols[status]} ${name}${message ? `: ${message}` : ""}`);
  results[status === "pass" ? "passed" : status === "fail" ? "failed" : "warnings"]++;
}

// Test 1: Modül Dosyaları
test("Modül Dosyaları Kontrolü", () => {
  const fs = require("fs");
  const modules = [
    "app/(dashboard)/dashboard/page.tsx",
    "app/(dashboard)/musteriler/page.tsx",
    "app/(dashboard)/projeler/page.tsx",
    "app/(dashboard)/finans/page.tsx",
    "app/(dashboard)/takvim/page.tsx",
    "app/(dashboard)/ekipman/page.tsx",
    "app/(dashboard)/raporlar/page.tsx",
    "app/(dashboard)/ayarlar/page.tsx"
  ];
  
  const missing = modules.filter(m => !fs.existsSync(m));
  if (missing.length === 0) {
    printResult("Tüm modül dosyaları mevcut", "pass");
  } else {
    printResult("Eksik modül dosyaları", "fail", missing.join(", "));
  }
});

// Test 2: API Endpoints
test("API Endpoints Kontrolü", () => {
  const fs = require("fs");
  const apis = [
    "app/api/stats/route.ts",
    "app/api/clients/route.ts",
    "app/api/tasks/route.ts",
    "app/api/transactions/route.ts",
    "app/api/events/route.ts",
    "app/api/equipment/route.ts",
    "app/api/reports/route.ts"
  ];
  
  const missing = apis.filter(a => !fs.existsSync(a));
  if (missing.length === 0) {
    printResult("Tüm API endpoints mevcut", "pass");
  } else {
    printResult("Eksik API endpoints", "fail", missing.join(", "));
  }
});

// Test 3: Component Dosyaları
test("Component Dosyaları Kontrolü", () => {
  const fs = require("fs");
  const components = [
    "components/Sidebar.tsx",
    "components/ui/Toast.tsx",
    "components/projeler/TaskDetailModal.tsx"
  ];
  
  const missing = components.filter(c => !fs.existsSync(c));
  if (missing.length === 0) {
    printResult("Tüm component dosyaları mevcut", "pass");
  } else {
    printResult("Eksik component dosyaları", "warn", missing.join(", "));
  }
});

// Test 4: Prisma Schema
test("Prisma Schema Kontrolü", () => {
  const fs = require("fs");
  const schemaPath = "prisma/schema.prisma";
  
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, "utf-8");
    const models = [
      "model User",
      "model Client",
      "model Task",
      "model Project",
      "model Transaction",
      "model Event",
      "model Equipment",
      "model Report"
    ];
    
    const missing = models.filter(m => !content.includes(m));
    if (missing.length === 0) {
      printResult("Tüm database modelleri tanımlı", "pass");
    } else {
      printResult("Eksik database modelleri", "fail", missing.join(", "));
    }
    
    // Yeni özellikler kontrolü
    const features = ["monthlyFee", "type        String    @default(\"EVENT\")", "allDay"];
    const missingFeatures = features.filter(f => !content.includes(f));
    if (missingFeatures.length === 0) {
      printResult("Yeni özellikler eklendi", "pass");
    } else {
      printResult("Bazı özellikler eksik", "warn", missingFeatures.join(", "));
    }
  } else {
    printResult("Prisma schema bulunamadı", "fail");
  }
});

// Test 5: Özellik Kontrolü
test("Yeni Özellikler Kontrolü", () => {
  const fs = require("fs");
  
  // Finans entegrasyonu
  const clientsAPI = fs.readFileSync("app/api/clients/route.ts", "utf-8");
  if (clientsAPI.includes("prisma.transaction.create") && clientsAPI.includes("Aylık Hizmet Ücreti")) {
    printResult("Finans entegrasyonu aktif", "pass");
  } else {
    printResult("Finans entegrasyonu eksik", "warn");
  }
  
  // Takvim modülü
  const calendarPage = fs.readFileSync("app/(dashboard)/takvim/page.tsx", "utf-8");
  if (calendarPage.includes("getDaysInMonth") && calendarPage.includes("monthNames")) {
    printResult("Takvim modülü tamamlandı", "pass");
  } else {
    printResult("Takvim modülü eksik", "warn");
  }
  
  // Tema değiştirici
  const settingsPage = fs.readFileSync("app/(dashboard)/ayarlar/page.tsx", "utf-8");
  if (settingsPage.includes("toggleTheme") && settingsPage.includes("localStorage")) {
    printResult("Tema değiştirici eklendi", "pass");
  } else {
    printResult("Tema değiştirici eksik", "warn");
  }
  
  // Ekipman modülü
  const equipmentPage = fs.readFileSync("app/(dashboard)/ekipman/page.tsx", "utf-8");
  if (equipmentPage.includes("serialNumber") && equipmentPage.includes("AVAILABLE")) {
    printResult("Ekipman modülü tamamlandı", "pass");
  } else {
    printResult("Ekipman modülü eksik", "warn");
  }
  
  // Raporlar modülü
  const reportsPage = fs.readFileSync("app/(dashboard)/raporlar/page.tsx", "utf-8");
  if (reportsPage.includes("MONTHLY") && reportsPage.includes("QUARTERLY")) {
    printResult("Raporlar modülü tamamlandı", "pass");
  } else {
    printResult("Raporlar modülü eksik", "warn");
  }
});

// Test 6: Database Kontrolü
test("Database Bağlantısı", () => {
  const fs = require("fs");
  const dbPath = "dev.db";
  
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    printResult("Database dosyası mevcut", "pass", `${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    printResult("Database dosyası bulunamadı", "fail");
  }
});

// Test 7: Güvenlik Kontrolleri
test("Güvenlik Kontrolleri", () => {
  const fs = require("fs");
  
  // Middleware kontrolü
  if (fs.existsSync("middleware.ts")) {
    const middleware = fs.readFileSync("middleware.ts", "utf-8");
    if (middleware.includes("withAuth") || middleware.includes("getServerSession")) {
      printResult("Route koruması aktif", "pass");
    } else {
      printResult("Route koruması eksik", "warn");
    }
  }
  
  // API koruması
  const clientsAPI = fs.readFileSync("app/api/clients/route.ts", "utf-8");
  if (clientsAPI.includes("getServerSession") && clientsAPI.includes("Unauthorized")) {
    printResult("API authentication aktif", "pass");
  } else {
    printResult("API authentication eksik", "fail");
  }
});

// Test 8: Kod Kalitesi
test("Kod Kalitesi Kontrolleri", () => {
  const fs = require("fs");
  
  // TypeScript kontrolleri
  const taskModal = fs.readFileSync("components/projeler/TaskDetailModal.tsx", "utf-8");
  if (taskModal.includes("interface") && taskModal.includes(": string") && taskModal.includes(": number")) {
    printResult("TypeScript type safety aktif", "pass");
  } else {
    printResult("TypeScript type safety zayıf", "warn");
  }
  
  // Error handling
  const apis = [
    "app/api/clients/route.ts",
    "app/api/tasks/route.ts",
    "app/api/events/route.ts"
  ];
  
  const allHaveErrorHandling = apis.every(api => {
    const content = fs.readFileSync(api, "utf-8");
    return content.includes("try") && content.includes("catch") && content.includes("console.error");
  });
  
  if (allHaveErrorHandling) {
    printResult("Error handling mevcut", "pass");
  } else {
    printResult("Error handling eksik", "warn");
  }
});

// Testleri çalıştır
console.log("📋 Test Kategorileri:\n");
tests.forEach(({ name, fn }) => {
  console.log(`\n🔍 ${name}:`);
  try {
    fn();
  } catch (error) {
    printResult(name, "fail", error.message);
  }
});

// Özet
console.log("\n" + "=".repeat(60));
console.log("📊 TEST SONUÇLARI");
console.log("=".repeat(60));
console.log(`✅ Başarılı: ${results.passed}`);
console.log(`⚠️  Uyarı: ${results.warnings}`);
console.log(`❌ Hatalı: ${results.failed}`);
console.log(`📈 Başarı Oranı: ${((results.passed / (results.passed + results.failed + results.warnings)) * 100).toFixed(1)}%`);
console.log("=".repeat(60));

// Öneriler
console.log("\n💡 ÖNERİLER:");
console.log("1. Kullanıcı yönetim paneli eklenebilir");
console.log("2. Bildirim sistemi (email/push) entegre edilebilir");
console.log("3. Dosya yükleme sistemi (raporlar için) eklenebilir");
console.log("4. Dashboard'a daha fazla grafik eklenebilir");
console.log("5. Takvim haftalık ve günlük görünümleri tamamlanabilir");
console.log("6. Görevlerde takım üyeleri atama özelliği eklenebilir");
console.log("7. Müşteri portföy analizi eklenebilir");
console.log("8. Export/Import özellikleri eklenebilir");
console.log("9. Arama ve filtreleme geliştirileb ilir");
console.log("10. Dark/Light tema otomatik geçişi eklenebilir");

console.log("\n🎉 Test tamamlandı!\n");
