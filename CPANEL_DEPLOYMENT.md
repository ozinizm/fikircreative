# Fikir Creative - AgencyOS
# cPanel Deployment Guide

## 🚀 cPanel'de Kurulum Adımları

### 1. Gereksinimler
- Node.js 18+ (cPanel'de Node.js Application oluşturun)
- PostgreSQL veritabanı
- SSL sertifikası (Let's Encrypt önerilir)

### 2. Veritabanı Kurulumu

#### PostgreSQL Veritabanı Oluşturma
```bash
# cPanel PostgreSQL Database bölümünden:
1. Yeni veritabanı oluşturun: fikir_agency_db
2. Yeni kullanıcı oluşturun: fikir_user
3. Kullanıcıya veritabanı izinleri verin (ALL PRIVILEGES)
```

### 3. Proje Dosyalarını Yükleme

```bash
# FTP veya cPanel File Manager ile:
1. Projeyi public_html dışında bir klasöre yükleyin
   Örnek: /home/username/fikir_agency/

2. Terminal'de proje dizinine gidin
cd ~/fikir_agency/
```

### 4. Environment Variables Ayarlama

```bash
# .env dosyasını düzenleyin
nano .env

# Aşağıdaki değerleri güncelleyin:
DATABASE_URL="postgresql://fikir_user:PASSWORD@localhost:5432/fikir_agency_db"
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-production-key-change-this
```

### 5. Bağımlılıkları Yükleme

```bash
# Node.js ve npm'in doğru versiyonunu kullandığınızdan emin olun
node --version  # 18+
npm --version

# Bağımlılıkları yükleyin
npm install

# Prisma client oluşturun
npx prisma generate

# Veritabanını migrate edin
npx prisma migrate deploy

# Seed data ekleyin (isteğe bağlı)
npx prisma db seed
```

### 6. Production Build

```bash
# Next.js production build
npm run build

# Build başarılı olduğundan emin olun
```

### 7. cPanel Node.js Application Kurulumu

```
1. cPanel → Setup Node.js App seçeneğine gidin
2. "Create Application" butonuna tıklayın
3. Ayarlar:
   - Node.js version: 18.x veya üstü
   - Application mode: Production
   - Application root: /home/username/fikir_agency
   - Application URL: yourdomain.com
   - Application startup file: server.js
   - Passenger log file: passenger.log
   
4. "Create" butonuna tıklayın
```

### 8. server.js Dosyası Oluşturma

```javascript
// server.js dosyasını oluşturun
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(\`> Ready on http://\${hostname}:\${port}\`)
    })
})
```

### 9. PM2 ile Çalıştırma (Önerilen)

```bash
# PM2 kurulumu
npm install -g pm2

# Uygulamayı başlatın
pm2 start npm --name "fikir-agency" -- start

# Sunucu yeniden başladığında otomatik başlat
pm2 startup
pm2 save

# Durumu kontrol edin
pm2 status
pm2 logs fikir-agency
```

### 10. SSL Sertifikası

```
1. cPanel → SSL/TLS seçeneğine gidin
2. Let's Encrypt sertifikası oluşturun
3. Domain için SSL'i aktif edin
```

### 11. .htaccess Yapılandırması

`.htaccess` dosyası zaten proje içinde mevcut (`public/.htaccess`).
Bu dosya HTTP isteklerini Node.js uygulamasına yönlendirir.

## 🔧 Sorun Giderme

### Port Kullanımda Hatası
```bash
# Kullanılan portu bulun
lsof -i :3000

# Process'i sonlandırın
kill -9 PID
```

### Database Connection Hatası
```bash
# PostgreSQL'in çalıştığını kontrol edin
pg_isready

# Connection string'i kontrol edin
cat .env | grep DATABASE_URL
```

### Build Hatası
```bash
# Cache temizle ve yeniden build
rm -rf .next
npm run build
```

## 📊 Performans Optimizasyonu

### 1. PM2 Cluster Mode
```bash
pm2 start npm --name "fikir-agency" -i max -- start
```

### 2. Redis Cache (isteğe bağlı)
```bash
# Redis kurulumu
npm install redis
```

### 3. CDN Kullanımı
- Statik dosyalar için Cloudflare veya benzeri CDN kullanın
- `next.config.js` içinde CDN domain'i ayarlayın

## 🔐 Güvenlik

1. `.env` dosyasının public erişime kapalı olduğundan emin olun
2. NEXTAUTH_SECRET'ı güçlü bir değerle değiştirin
3. Production'da hata detaylarını gizleyin
4. Rate limiting ekleyin
5. CORS ayarlarını yapılandırın

## 📝 Önemli Notlar

- İlk giriş: `admin@fikir.agency` / `Admin123!`
- Şifreleri mutlaka değiştirin
- Düzenli yedekleme yapın
- Log dosyalarını kontrol edin
- Performans metriklerini izleyin

## 🆘 Destek

Sorun yaşarsanız:
1. `pm2 logs fikir-agency` ile logları kontrol edin
2. `prisma studio` ile veritabanını inceleyin
3. `.next` klasörünü silip yeniden build alın

## 🔄 Güncelleme

```bash
# Git ile güncellemeleri çekin
git pull origin main

# Bağımlılıkları güncelleyin
npm install

# Database migrate
npx prisma migrate deploy

# Yeniden build
npm run build

# Restart
pm2 restart fikir-agency
```
