# 🚀 cPanel Deployment - Son Adımlar

## ✅ HAZIRLIK TAMAMLANDI!

Build başarılı! Şimdi cPanel'e yükleyebilirsiniz.

---

## 📦 1. DOSYALARI ZIP'LE (Windows'ta)

Sıkıştırmadan ÖNCE bu dosyaları **SİLİN**:
```
- node_modules/ klasörü (sunucuda yüklenecek)
- dev.db (SQLite - artık kullanılmıyor)
- .git/ klasörü
```

Sıkıştırılacak dosyalar:
```
✅ .next/ klasörü (build çıktısı)
✅ app/ klasörü
✅ components/ klasörü
✅ lib/ klasörü
✅ prisma/ klasörü
✅ public/ klasörü
✅ .env dosyası
✅ package.json
✅ package-lock.json
✅ next.config.js
✅ middleware.ts
✅ ecosystem.config.js
✅ .cpanel.yml
```

**ZIP Komutı (PowerShell):**
```powershell
# node_modules'u sil (sunucuda yeniden yüklenecek)
Remove-Item -Recurse -Force node_modules

# ZIP oluştur
Compress-Archive -Path * -DestinationPath agencyos-deploy.zip
```

---

## 🌐 2. cPANEL'E GİRİŞ

1. https://panel.fikircreative.com:2083 (veya hosting panel adresi)
2. Username ve şifre ile giriş yapın

---

## 📁 3. FILE MANAGER İLE YÜKLEME

### Adım 1: Klasör Hazırlama
1. File Manager'ı açın
2. `public_html` veya `panel.fikircreative.com` klasörüne gidin
3. Varsa eski dosyaları temizleyin (YEDEK ALIN!)

### Adım 2: ZIP Yükleme
1. "Upload" butonuna tıklayın
2. `agencyos-deploy.zip` dosyasını seçin
3. Yükleme bitince sağ tıklayın → "Extract"
4. ZIP dosyasını silebilirsiniz

---

## 🔧 4. SSH İLE KURULUM

cPanel → Terminal (veya SSH ile bağlanın)

```bash
# Doğru klasöre git
cd ~/panel.fikircreative.com

# Node.js versiyonunu kontrol et (14+ olmalı)
node -v

# node_modules'u yükle
npm install --production

# Prisma'yı hazırla
npx prisma generate
npx prisma db push

# İlk admin kullanıcısını oluştur
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  const hash = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@fikir.agency',
      password: hash,
      role: 'ADMIN'
    }
  });
  console.log('Admin oluşturuldu:', admin.email);
  await prisma.\$disconnect();
}

createAdmin();
"
```

---

## ⚙️ 5. NODE.JS APP KURULUMU (cPanel)

### Setup Application
1. cPanel → Software → Setup Node.js App
2. "Create Application" tıklayın

**Ayarlar:**
```
Node.js Version: 18.x veya üzeri
Application Mode: Production
Application Root: panel.fikircreative.com (klasör adı)
Application URL: panel.fikircreative.com
Application Startup File: node_modules/next/dist/bin/next
```

3. "Create" butonuna tıklayın

### Environment Variables Ekle
App ayarlarına girin ve şu değişkenleri ekleyin:

```
NODE_ENV = production
DATABASE_URL = mysql://fikircre_agencyos_user:A244466666a.!@localhost:3306/fikircre_agencyos
NEXTAUTH_URL = https://panel.fikircreative.com
NEXTAUTH_SECRET = 102feac22e1c35d48ef3f4e233187a9c87119ba8dc99ad017f0a6bb205395e00
PORT = 3000
```

4. "Save" tıklayın
5. "Start Application" ile başlatın

---

## 🔐 6. SSL KURULUMU (ÖNEMLİ!)

1. cPanel → Security → SSL/TLS Status
2. `panel.fikircreative.com` için "Run AutoSSL" tıklayın
3. Let's Encrypt sertifikası otomatik kurulacak
4. 5-10 dakika bekleyin

---

## 🎯 7. TEST ETMEk

### Tarayıcıda Test:
```
https://panel.fikircreative.com
```

**Login Bilgileri:**
- Email: `admin@fikir.agency`
- Şifre: `Admin123!`

### Test Checklist:
- [ ] Site açılıyor mu?
- [ ] Login çalışıyor mu?
- [ ] Dashboard yükleniyor mu?
- [ ] Müşteri ekleme çalışıyor mu?
- [ ] Proje oluşturma çalışıyor mu?
- [ ] Finans modülü çalışıyor mu?
- [ ] Takvim görünüyor mu?
- [ ] Tema değişimi çalışıyor mu?

---

## 🐛 SORUN GİDERME

### 1. "Application Error" Hatası
```bash
# Log'lara bak
cd ~/panel.fikircreative.com
pm2 logs

# veya
cat ~/logs/node_*
```

### 2. Database Bağlantı Hatası
```bash
# MySQL şifresini kontrol et
cat .env | grep DATABASE_URL

# Prisma'yı tekrar generate et
npx prisma generate
```

### 3. Build Hatası
```bash
# .next klasörünü temizle
rm -rf .next
npm run build
```

### 4. Port 3000 Zaten Kullanılıyor
```bash
# Uygulamayı yeniden başlat
pm2 restart all
```

### 5. SSL Çalışmıyor
- cPanel'de AutoSSL'in tamamlandığından emin olun
- Propagasyon için 24 saat bekleyin
- NEXTAUTH_URL'in https:// ile başladığından emin olun

---

## 📊 PM2 İLE YÖNETİM (Opsiyonel)

```bash
# PM2 kur (global)
npm install -g pm2

# Uygulamayı başlat
pm2 start ecosystem.config.js

# Durumu kontrol et
pm2 status

# Log'ları izle
pm2 logs

# Yeniden başlat
pm2 restart fikir-creative-agencyos

# Durdur
pm2 stop fikir-creative-agencyos
```

---

## 🔄 GÜNCELLEME İÇİN

Kod değişikliği yaptığınızda:

```bash
# Dosyaları FTP ile yükleyin
# SSH'a bağlanın:

cd ~/panel.fikircreative.com
npm install  # Yeni paket varsa
npm run build  # Build alın
pm2 restart all  # Yeniden başlatın
```

---

## 📞 DESTEK

Sorun yaşarsanız:
1. SSH log'larını kontrol edin: `pm2 logs` veya `cat ~/logs/node_*`
2. .env dosyasını kontrol edin
3. MySQL bağlantısını test edin
4. Hosting sağlayıcınızın Node.js desteğini kontrol edin

---

## ✅ SON KONTROL LİSTESİ

Deployment öncesi:
- [x] Production build başarılı
- [x] .env MySQL bilgileri doğru
- [x] node_modules silindi (ZIP'e dahil edilmedi)
- [ ] ZIP dosyası oluşturuldu
- [ ] cPanel'e yüklendi
- [ ] npm install yapıldı
- [ ] prisma db push yapıldı
- [ ] Admin kullanıcı oluşturuldu
- [ ] Node.js App başlatıldı
- [ ] SSL kuruldu
- [ ] Site test edildi

---

**🎉 BAŞARILAR! Herhangi bir sorun olursa buradan devam ederiz.**
