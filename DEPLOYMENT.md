# FikirCreative AgencyOS - Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] .env dosyasını güncelle (production values)
- [ ] NEXTAUTH_SECRET güvenli key ile değiştir
- [ ] DATABASE_URL production database'e çevir (MySQL/PostgreSQL)
- [ ] NEXTAUTH_URL production domain'e çevir

### 2. Database Migration
- [ ] SQLite'dan MySQL/PostgreSQL'e geçiş
- [ ] Prisma schema güncelle
- [ ] Migration dosyaları oluştur
- [ ] Seed data kontrol et

### 3. Security
- [ ] Rate limiting aktif
- [ ] CORS ayarları yapılandır
- [ ] Security headers kontrol et
- [ ] Input validation tamamla

### 4. Performance
- [ ] Production build test et: `npm run build`
- [ ] Bundle size kontrol et
- [ ] Image optimization kontrol et
- [ ] API response cache stratejisi

### 5. Testing
- [ ] Tüm modüller test et
- [ ] API endpoints test et
- [ ] Authentication flow test et
- [ ] Mobile responsive kontrol et

---

## 🚀 cPanel Deployment Steps

### Step 1: cPanel'de Node.js Uygulaması Oluştur

1. cPanel > Setup Node.js App
2. Node.js Version: **18.x veya üzeri**
3. Application Mode: **Production**
4. Application Root: `/home/username/agencyos`
5. Application URL: `https://agencyos.yourdomain.com`
6. Application Startup File: `server.js`

### Step 2: Dosyaları Upload Et

```bash
# Lokal makineyde production build oluştur
npm run build

# FTP/SSH ile dosyaları yükle:
- .next/
- node_modules/ (veya server'da npm install çalıştır)
- public/
- prisma/
- app/
- components/
- lib/
- .env.production
- package.json
- next.config.js
- server.js
```

### Step 3: Database Kurulumu

cPanel > MySQL Databases:
1. Yeni database oluştur: `username_agencyos`
2. Yeni user oluştur: `username_agency`
3. User'a database üzerinde tüm yetkiler ver
4. .env dosyasını güncelle:

```env
DATABASE_URL="mysql://username_agency:password@localhost:3306/username_agencyos"
```

### Step 4: Prisma Migration

```bash
# SSH üzerinden
cd /home/username/agencyos
npx prisma generate
npx prisma db push
npm run db:seed
```

### Step 5: Node.js App Başlat

1. cPanel > Setup Node.js App
2. "Run NPM Install" butonuna tıkla
3. "Restart" butonuna tıkla
4. "Open" ile siteyi test et

### Step 6: SSL Kurulumu

cPanel > SSL/TLS:
1. Let's Encrypt SSL yükle
2. HTTPS yönlendirmesi aktif et

---

## 📝 Environment Variables (Production)

```env
# Database (MySQL)
DATABASE_URL="mysql://user:pass@localhost:3306/dbname"

# NextAuth
NEXTAUTH_URL="https://agencyos.yourdomain.com"
NEXTAUTH_SECRET="GENERATE_RANDOM_SECRET_HERE"

# App
NODE_ENV="production"
PORT=3000

# Email (Optional)
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your_email_password"
SMTP_FROM="FikirOS <noreply@yourdomain.com>"
```

---

## 🔧 Troubleshooting

### Problem: Node.js app başlamıyor
**Çözüm**: 
- cPanel logs kontrol et
- `npm install` tekrar çalıştır
- `node -v` ile Node.js versiyonu kontrol et

### Problem: Database bağlantı hatası
**Çözüm**:
- DATABASE_URL doğru mu kontrol et
- MySQL user yetkilerini kontrol et
- `npx prisma db push` tekrar çalıştır

### Problem: 404 hatası
**Çözüm**:
- .htaccess dosyası oluştur:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

### Problem: Environment variables tanınmıyor
**Çözüm**:
- cPanel > Setup Node.js App > Environment Variables bölümünden ekle
- .env dosyasının doğru dizinde olduğundan emin ol

---

## 📊 Post-Deployment Checklist

- [ ] Tüm sayfalar açılıyor mu?
- [ ] Login çalışıyor mu?
- [ ] CRUD işlemleri çalışıyor mu?
- [ ] Bildirimler çalışıyor mu?
- [ ] Email gönderimi test et
- [ ] Mobile görünüm kontrol et
- [ ] SSL sertifikası aktif mi?
- [ ] Performance test (GTmetrix/PageSpeed)
- [ ] Backup stratejisi kur

---

## 🎯 Next Steps After Deployment

1. **Monitoring**: Uptime monitoring ekle (UptimeRobot)
2. **Analytics**: Google Analytics entegre et
3. **Backup**: Otomatik backup sistemi kur
4. **CDN**: Cloudflare gibi CDN kullan
5. **Email**: Transactional email servisi ekle (SendGrid, AWS SES)
6. **Documentation**: Kullanıcı dokümantasyonu hazırla
7. **Training**: Ekibe eğitim ver

---

## 📞 Support

Deployment sırasında sorun yaşarsanız:
- cPanel support ticket aç
- Hosting provider ile iletişime geç
- Node.js logs kontrol et: `/home/username/agencyos/logs/`
