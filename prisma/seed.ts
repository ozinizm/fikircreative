import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@fikir.agency" },
    update: {},
    create: {
      email: "admin@fikir.agency",
      password: hashedPassword,
      name: "Admin",
      phone: "+90 555 000 0000",
      position: "Sistem Yöneticisi",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin kullanıcı oluşturuldu:", admin.email);

  // Demo kullanıcı oluştur
  const demoPassword = await bcrypt.hash("Demo123!", 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@fikir.agency" },
    update: {},
    create: {
      email: "demo@fikir.agency",
      password: demoPassword,
      name: "Demo Kullanıcı",
      phone: "+90 555 111 1111",
      position: "Proje Yöneticisi",
      role: "USER",
    },
  });

  console.log("✅ Demo kullanıcı oluşturuldu:", demoUser.email);

  // Demo müşteriler
  const client1 = await prisma.client.create({
    data: {
      name: "Global Tech Inc.",
      contact: "Ayşe Yılmaz",
      email: "ayse@globaltech.com",
      phone: "+90 555 123 4567",
      website: "globaltech.com",
      address: "İstanbul, Türkiye",
      status: "ACTIVE",
      userId: admin.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Innovate Solutions",
      contact: "Mehmet Kaya",
      email: "mehmet@innovate.com",
      phone: "+90 555 234 5678",
      website: "innovatesolutions.com",
      address: "Ankara, Türkiye",
      status: "ACTIVE",
      userId: admin.id,
    },
  });

  console.log("✅ Demo müşteriler oluşturuldu");

  // Demo projeler
  const project1 = await prisma.project.create({
    data: {
      title: "Website Yenileme Projesi",
      description: "Kurumsal web sitesi tasarım ve geliştirme",
      status: "IN_PROGRESS",
      priority: "HIGH",
      deadline: new Date("2025-01-15"),
      budget: 25000,
      clientId: client1.id,
      userId: admin.id,
    },
  });

  console.log("✅ Demo proje oluşturuldu");

  // Demo görevler
  await prisma.task.createMany({
    data: [
      {
        title: "Ana Sayfa Arayüz Tasarımı",
        description: "Modern ve responsive tasarım",
        status: "TODO",
        priority: "HIGH",
        deadline: new Date("2024-12-25"),
        tags: JSON.stringify(["Tasarım", "Frontend"]),
        projectId: project1.id,
        userId: admin.id,
      },
      {
        title: "Veritabanı Şeması Oluşturma",
        description: "PostgreSQL database design",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        deadline: new Date("2024-12-28"),
        tags: JSON.stringify(["Backend", "Database"]),
        projectId: project1.id,
        userId: admin.id,
      },
    ],
  });

  console.log("✅ Demo görevler oluşturuldu");

  // Demo finans işlemleri
  await prisma.transaction.createMany({
    data: [
      {
        title: "Tasarım Projesi Ödemesi",
        description: "Web tasarımı ilk taksit",
        amount: 15000,
        type: "INCOME",
        status: "COMPLETED",
        date: new Date("2024-12-01"),
        clientId: client1.id,
        userId: admin.id,
      },
      {
        title: "Yazılım Aboneliği",
        description: "Adobe Creative Cloud",
        amount: 2500,
        type: "EXPENSE",
        status: "COMPLETED",
        date: new Date("2024-12-05"),
        userId: admin.id,
      },
    ],
  });

  console.log("✅ Demo finans işlemleri oluşturuldu");

  // Demo ekipman
  await prisma.equipment.createMany({
    data: [
      {
        name: 'MacBook Pro 16"',
        category: "Bilgisayar",
        serialNumber: "MB-2024-001",
        status: "IN_USE",
        assignedTo: "Ahmet Yılmaz",
        userId: admin.id,
      },
      {
        name: "Canon EOS R5",
        category: "Kamera",
        serialNumber: "CAM-2024-012",
        status: "IN_USE",
        assignedTo: "Mehmet Kaya",
        userId: admin.id,
      },
    ],
  });

  console.log("✅ Demo ekipman oluşturuldu");

  // Demo etkinlikler
  await prisma.event.createMany({
    data: [
      {
        title: "Müşteri Toplantısı",
        description: "Global Tech Inc. ile proje review",
        startDate: new Date("2024-12-29T10:00:00"),
        endDate: new Date("2024-12-29T11:00:00"),
        color: "#dc2626",
        userId: admin.id,
      },
      {
        title: "Proje Teslimi",
        description: "Website beta versiyonu",
        startDate: new Date("2024-12-30T14:00:00"),
        endDate: new Date("2024-12-30T15:00:00"),
        color: "#2563eb",
        userId: admin.id,
      },
    ],
  });

  console.log("✅ Demo etkinlikler oluşturuldu");

  console.log("\n🎉 Database seeding tamamlandı!");
  console.log("\n📝 Giriş Bilgileri:");
  console.log("   Admin: admin@fikir.agency / Admin123!");
  console.log("   Demo:  demo@fikir.agency / Demo123!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
