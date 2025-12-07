# 🚀 FikirCreative AgencyOS - Deployment Rehberi

## 📋 İçindekiler
- [Vercel Deployment](#vercel-deployment)
- [cPanel Deployment](#cpanel-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🌐 Vercel Deployment (Önerilen)

### Avantajlar:
- ✅ Otomatik HTTPS
- ✅ Global CDN
- ✅ Otomatik scaling
- ✅ Kolay deployment
- ✅ PostgreSQL desteği (Vercel Postgres)

### Adım 1: Vercel Hesabı
1. [vercel.com](https://vercel.com) adresinden hesap oluşturun
2. GitHub repository'nizi bağlayın

### Adım 2: Veritabanı Kurulumu

**Seçenek A: Vercel Postgres (Önerilen)**
```bash
# Vercel dashboard'dan:
Storage > Create Database > Postgres
# Connection string'i kopyalayın
```

**Seçenek B: Neon.tech (Ücretsiz PostgreSQL)**
1. [neon.tech](https://neon.tech) adresinden ücretsiz hesap açın
2. Yeni proje oluşturun
3. Connection string'i kopyalayın

### Adım 3: Environment Variables
Vercel Dashboard > Settings > Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[openssl rand -base64 32 ile oluşturun]
```

### Adım 4: Deploy
```bash
# Vercel CLI ile
npm i -g vercel
vercel login
vercel --prod

# Veya GitHub'dan otomatik deploy
# Her push'ta otomatik deploy olur
```

### Adım 5: İlk Kullanıcı Oluşturma
Deployment sonrası:
```bash
# Vercel CLI ile
vercel env pull .env.production
npm run db:seed
```

---

## 🏢 cPanel Deployment

### Gereksinimler:
- Node.js 18+ destekleyen hosting
- MySQL veritabanı
- SSH erişimi (önerilir)

### Adım 1: cPanel'de MySQL Database Oluştur

1. cPanel > MySQL Databases
2. **Create New Database:** `username_agencyos`
3. **Create New User:** `username_agency`
   - Güçlü şifre oluşturun (kaydedin!)
4. **Add User to Database:**
   - User: username_agency
   - Database: username_agencyos
   - Privileges: ALL PRIVILEGES
   - Save

### Adım 2: Node.js Application Oluştur

1. cPanel > Setup Node.js App > Create Application
   ```
   Node.js version: 18.x veya 20.x
   Application mode: Production
   Application root: agencyos (public_html dışında)
   Application URL: https://subdomain.yourdomain.com
   Application startup file: server.js
   ```

2. **Environment Variables Ekle:**
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://username_agency:PASSWORD@localhost:3306/username_agencyos
   NEXTAUTH_URL=https://subdomain.yourdomain.com
   NEXTAUTH_SECRET=[yeni secret oluştur]
   PORT=3000
   ```

### Adım 3: Dosyaları Upload Et

**FTP/SSH ile yüklenecek dosyalar:**
```
agencyos/
├── .next/                 # Build output (npm run build sonrası)
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── node_modules/          # veya sunucuda npm install
├── .env.production        # Environment variables
├── package.json
├── package-lock.json
├── next.config.js
├── middleware.ts
├── server.js
└── ecosystem.config.js
```

### Adım 4: Terminal'de Kurulum

**SSH üzerinden:**
```bash
cd ~/agencyos

# 1. Dependencies yükle
npm install --production

# 2. Prisma setup
npx prisma generate
npx prisma db push --accept-data-loss

# 3. İlk kullanıcı oluştur
npm run db:seed

# 4. Production build
npm run build

# 5. Test et (opsiyonel)
npm start # Ctrl+C ile durdur

# 6. PM2 ile başlat (cPanel Node.js App yerine)
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Adım 5: Subdomain Ayarları

1. cPanel > Subdomains
2. **Create Subdomain:**
   ```
   Subdomain: panel
   Domain: yourdomain.com
   Document Root: /home/username/public_html/panel
   ```

3. **.htaccess oluştur** (`public_html/panel/.htaccess`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

4. **SSL Sertifikası:**
   - cPanel > SSL/TLS > Let's Encrypt
   - Subdomain için sertifika oluştur

---

## 🔐 Environment Variables

### Development (.env)
```env
NODE_ENV=development
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"
ADMIN_EMAIL="admin@fikir.agency"
ADMIN_PASSWORD="Admin123!"
```

### Production (.env.production)
```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@localhost:3306/db"  # veya PostgreSQL
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="[openssl rand -base64 32]"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="SuperSecurePassword123!"
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="email_password"
SMTP_FROM="AgencyOS <noreply@yourdomain.com>"
```

### Secret Oluşturma
```bash
# Terminal'de:
openssl rand -base64 32

# veya Node.js ile:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔧 Troubleshooting

### ❌ Problem: Build Hatası
```bash
# Çözüm 1: Cache temizle
rm -rf .next node_modules
npm install
npm run build

# Çözüm 2: Prisma yeniden generate et
npx prisma generate
npm run build
```

### ❌ Problem: Database Bağlantı Hatası
```bash
# MySQL için:
DATABASE_URL="mysql://user:pass@localhost:3306/db"

# PostgreSQL için:
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Test et:
npx prisma db push
```

### ❌ Problem: NextAuth Session Hatası
```env
# .env dosyasını kontrol et:
NEXTAUTH_URL="https://yourdomain.com"  # http:// DEĞIL!
NEXTAUTH_SECRET="yeni-secret-oluştur"  # Mutlaka değiştir!
```

### ❌ Problem: 502 Bad Gateway (cPanel)
```bash
# Çözüm 1: Node.js app restart
cPanel > Setup Node.js App > Restart

# Çözüm 2: Logs kontrol et
cd ~/agencyos
cat logs/nodejs.log

# Çözüm 3: PM2 restart
pm2 restart all
pm2 logs
```

### ❌ Problem: Module Not Found
```bash
# Çözüm: Dependencies yeniden yükle
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### ❌ Problem: Vercel Build Failed
```bash
# Vercel dashboard'da build logs kontrol et
# Environment variables doğru mu?
# DATABASE_URL connection string SSL gerektirir:
postgresql://...?sslmode=require
```

---

## 📊 Post-Deployment Checklist

- [ ] Database connection çalışıyor mu?
- [ ] Admin kullanıcısı oluşturuldu mu?
- [ ] Login fonksiyonu çalışıyor mu?
- [ ] SSL sertifikası aktif mi?
- [ ] Email gönderimi test edildi mi? (opsiyonel)
- [ ] Mobile responsive kontrol edildi mi?
- [ ] Error tracking kuruldu mu? (Sentry vb.)
- [ ] Analytics eklendi mi? (Google Analytics vb.)
- [ ] Backup stratejisi oluşturuldu mu?
- [ ] Domain DNS ayarları doğru mu?

---

## 🎯 Performance Optimizations

### 1. Database Indexing
```sql
-- Prisma schema'da @index ekle
-- Sık kullanılan query'ler için

model Client {
  id     String @id
  email  String @unique
  userId String
  
  @@index([userId])
  @@index([email])
}
```

### 2. API Caching
```typescript
// Route handler'da:
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  });
}
```

### 3. Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
  priority // Above the fold images için
/>
```

---

## 📞 Destek

Sorun yaşarsanız:
1. Bu guide'daki troubleshooting bölümünü kontrol edin
2. GitHub Issues: [github.com/yourrepo/issues](https://github.com)
3. Email: support@yourdomain.com

---

## 🔄 Güncelleme

```bash
# Yeni versiyon deploy etmek için:
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy  # Eğer schema değişti ise
npm run build

# Vercel: Otomatik deploy
# cPanel: PM2 restart veya Node.js app restart
```

---

**Başarılı deployments! 🚀**
