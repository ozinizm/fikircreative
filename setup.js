#!/usr/bin/env node
/**
 * cPanel Kurulum Script
 * Bu dosyayı Node.js App içinden "Run Script" ile çalıştırın
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function setup() {
  console.log('🚀 Kurulum başlatılıyor...\n');

  const prisma = new PrismaClient();

  try {
    // Database bağlantısını test et
    console.log('📊 Database bağlantısı kontrol ediliyor...');
    await prisma.$connect();
    console.log('✅ Database bağlantısı başarılı!\n');

    // Admin kullanıcısını kontrol et
    console.log('👤 Admin kullanıcısı kontrol ediliyor...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@fikir.agency' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcısı zaten mevcut.\n');
    } else {
      // Admin oluştur
      console.log('👤 Admin kullanıcısı oluşturuluyor...');
      const hash = await bcrypt.hash('Admin123!', 10);
      
      const admin = await prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@fikir.agency',
          password: hash,
          role: 'ADMIN'
        }
      });

      console.log('✅ Admin kullanıcısı oluşturuldu!');
      console.log('   Email: admin@fikir.agency');
      console.log('   Şifre: Admin123!\n');
    }

    // Veritabanı istatistikleri
    console.log('📈 Veritabanı istatistikleri:');
    const userCount = await prisma.user.count();
    const clientCount = await prisma.client.count();
    const projectCount = await prisma.project.count();
    
    console.log(`   Kullanıcılar: ${userCount}`);
    console.log(`   Müşteriler: ${clientCount}`);
    console.log(`   Projeler: ${projectCount}\n`);

    console.log('🎉 Kurulum tamamlandı!\n');
    console.log('🌐 Site: https://panel.fikircreative.com');
    console.log('📧 Login: admin@fikir.agency');
    console.log('🔑 Şifre: Admin123!\n');

  } catch (error) {
    console.error('❌ HATA:', error.message);
    
    if (error.message.includes('P1001')) {
      console.error('\n⚠️  Database sunucusuna bağlanılamadı!');
      console.error('   .env dosyasındaki DATABASE_URL kontrol edin.');
    } else if (error.message.includes('P2002')) {
      console.error('\n⚠️  Admin kullanıcısı zaten mevcut.');
    } else {
      console.error('\n💡 Çözüm önerileri:');
      console.error('   1. npx prisma generate çalıştırın');
      console.error('   2. npx prisma db push çalıştırın');
      console.error('   3. .env dosyasını kontrol edin');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
