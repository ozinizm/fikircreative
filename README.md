# Fikir Creative - AgencyOS

Modern, profesyonel dijital ajans yönetim platformu - **Tam Özellikli & Production Ready**

## 🚀 Özellikler

### ✅ Tamamlanan Modüller

- **🔐 Authentication System** - NextAuth.js ile güvenli giriş sistemi
- **👥 Kullanıcı Yönetimi** - Admin ve kullanıcı rolleri
- **📊 Dashboard (Gösterge Paneli)** - İstatistikler, grafikler ve özet görünüm
- **📋 Görev Yönetimi (Kanban)** - Proje görevlerini sürükle-bırak ile yönetme
- **🏢 Müşteri Yönetimi (CRM)** - Müşteri bilgileri, projeler ve ödemeler
- **📄 Rapor Yönetimi** - Dosya yükleme ve rapor listeleme
- **💰 Finans Modülü** - Gelir/gider takibi ve finansal grafikler
- **📅 Takvim** - Etkinlik ve toplantı yönetimi
- **🖥️ Ekipman Yönetimi** - Şirket ekipmanlarını takip
- **⚙️ Ayarlar** - Kullanıcı profili ve sistem ayarları
- **🗄️ Database** - PostgreSQL + Prisma ORM
- **🌐 cPanel Ready** - Production deployment hazır

## 🛠️ Teknoloji Stack

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Authentication:** NextAuth.js v4
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **State Management:** Zustand (hazır)
- **Icons:** Lucide React
- **Form Validation:** React Hook Form + Zod (hazır)
- **Password Hashing:** bcryptjs
- **Deployment:** cPanel compatible

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ 
- PostgreSQL database
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
\`\`\`bash
npm install
\`\`\`

2. **Environment variables ayarlayın:**
\`\`\`bash
# .env.example'ı kopyalayın
cp .env.example .env

# .env dosyasını düzenleyin
# DATABASE_URL'i kendi PostgreSQL bilgilerinizle güncelleyin
\`\`\`

3. **Veritabanını kurun:**
\`\`\`bash
# Prisma migrate
npx prisma migrate dev

# Seed data (demo veriler)
npm run db:seed
\`\`\`

4. **Geliştirme sunucusunu başlatın:**
\`\`\`bash
npm run dev
\`\`\`

5. **Tarayıcıda açın:**
\`\`\`
http://localhost:3000
\`\`\`

## 🔐 Giriş Bilgileri

### Admin
- **Email:** admin@fikir.agency
- **Şifre:** Admin123!

### Demo Kullanıcı
- **Email:** demo@fikir.agency
- **Şifre:** Demo123!

⚠️ **Production'da mutlaka şifreleri değiştirin!**

## 📁 Proje Yapısı

\`\`\`
FikirCreative/
├── app/
│   ├── (dashboard)/           # Protected routes
│   │   ├── dashboard/         # Gösterge paneli
│   │   ├── projeler/          # Görev yönetimi
│   │   ├── musteriler/        # CRM modülü
│   │   ├── raporlar/          # Rapor yönetimi
│   │   ├── finans/            # Finans modülü
│   │   ├── takvim/            # Takvim
│   │   ├── ekipman/           # Ekipman yönetimi
│   │   └── ayarlar/           # Ayarlar
│   ├── api/
│   │   └── auth/              # NextAuth API routes
│   ├── login/                 # Login sayfası
│   └── layout.tsx             # Root layout
├── components/
│   ├── layout/                # Sidebar, Header
│   ├── dashboard/             # Dashboard bileşenleri
│   ├── projeler/              # Kanban bileşenleri
│   ├── musteriler/            # CRM bileşenleri
│   └── finans/                # Finans bileşenleri
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # NextAuth config
│   └── utils.ts               # Utility fonksiyonlar
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── types/                     # TypeScript types
├── middleware.ts              # Auth middleware
├── server.js                  # Production server (cPanel)
└── CPANEL_DEPLOYMENT.md       # cPanel deployment guide
\`\`\`

## 🌐 cPanel Deployment

Detaylı cPanel deployment talimatları için:
\`\`\`bash
# Deployment guide'ı okuyun
cat CPANEL_DEPLOYMENT.md
\`\`\`

### Hızlı Özet:
1. PostgreSQL veritabanı oluşturun
2. Proje dosyalarını yükleyin
3. `.env` dosyasını düzenleyin
4. `npm install && npm run build`
5. cPanel Node.js Application oluşturun
6. PM2 ile başlatın

## 🗄️ Veritabanı Yönetimi

\`\`\`bash
# Prisma Studio ile database'i görüntüle
npm run db:studio

# Yeni migration oluştur
npx prisma migrate dev --name migration_name

# Production'da migrate
npx prisma migrate deploy

# Seed data ekle
npm run db:seed
\`\`\`

## 🔄 Build ve Deploy

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Vercel Deploy
\`\`\`bash
vercel
\`\`\`

## 📊 Database Schema

### Ana Modeller:
- **User** - Kullanıcılar (Admin/User rolleri)
- **Client** - Müşteriler
- **Project** - Projeler
- **Task** - Görevler
- **Report** - Raporlar
- **Transaction** - Finans işlemleri
- **Equipment** - Ekipman
- **Event** - Takvim etkinlikleri
- **Note** - Notlar

## 🔐 Güvenlik Özellikleri

- ✅ Password hashing (bcryptjs)
- ✅ JWT session tokens
- ✅ Protected routes (middleware)
- ✅ Role-based access control (ADMIN/USER)
- ✅ Environment variables
- ✅ CSRF protection (NextAuth)
- ✅ SQL injection prevention (Prisma)

## 📱 Responsive Design

Tüm sayfalar tam responsive:
- 📱 Mobile: Tek sütun layout
- 📲 Tablet: 2 sütun grid
- 💻 Desktop: 3-4 sütun grid

## 🎨 Tasarım Sistemi

### Renk Paleti:
- **Primary:** Kırmızı (#dc2626)
- **Background:** Koyu gri (#0d0d0d, #1a1a1a, #252525)
- **Border:** #2a2a2a
- **Text:** Beyaz (#ffffff) ve gri tonları

## 🔜 Gelecek Özellikler

- [ ] Drag & Drop görev yönetimi
- [ ] Real-time bildirimler (WebSocket)
- [ ] Google Calendar entegrasyonu
- [ ] S3 dosya yükleme
- [ ] Multi-language desteği
- [ ] Dark/Light mode toggle
- [ ] Export/Import özellikleri
- [ ] Advanced filtreleme ve arama
- [ ] Email bildirimleri
- [ ] 2FA authentication

## 🐛 Hata Giderme

### Port zaten kullanımda
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
\`\`\`

### Database bağlantı hatası
\`\`\`bash
# PostgreSQL'in çalıştığını kontrol edin
# .env dosyasındaki DATABASE_URL'i kontrol edin
npx prisma db push
\`\`\`

### Build hatası
\`\`\`bash
# Cache temizle
rm -rf .next
npm run build
\`\`\`

## 📖 API Routes

- `POST /api/auth/signin` - Login
- `GET /api/auth/session` - Current session
- `POST /api/auth/signout` - Logout

## 👥 Roller ve İzinler

### ADMIN
- Tüm özelliklere erişim
- Kullanıcı yönetimi
- Sistem ayarları
- Tüm verileri görüntüleme/düzenleme

### USER
- Kendi verilerine erişim
- Görev yönetimi
- Müşteri görüntüleme
- Rapor oluşturma

## 📄 Lisans

Private - Tüm hakları saklıdır.

## 🆘 Destek

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Prisma Studio ile database'i inceleyin
3. `.next` klasörünü silip yeniden build alın

## 🙏 Teşekkürler

Fikir Creative Team tarafından geliştirilmiştir.

