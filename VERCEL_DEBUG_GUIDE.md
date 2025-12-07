# 🔍 Vercel Production Debug Rehberi

## ❌ Yaşanan Sorunlar

### 1. Müşteri Verileri Kaydolmuyor
**Belirti:** Müşteri formu gönderiliyor, finans kaydı oluşuyor ama müşteri listede görünmüyor.

**Olası Nedenler:**
- ✅ Database bağlantısı çalışıyor (finans kaydı oluşuyor)
- ❌ Response handling sorunu olabilir
- ❌ Frontend'de refetch olmuyor olabilir

### 2. Takvim Verileri Kaydolmuyor
**Belirti:** Event formu gönderiliyor ama takvimde görünmüyor.

**Olası Nedenler:**
- ❌ Validation hatası
- ❌ Date parsing problemi
- ❌ Null value handling

## 🔧 Debug Adımları

### 1. Vercel Logs Kontrol Et
```bash
# Vercel CLI ile real-time logs
vercel logs --follow

# Belirli bir deployment için
vercel logs [deployment-url]
```

**Ne Arayacaksın:**
- Console.log outputs
- Error messages
- Database query errors
- Validation errors

### 2. Browser Console Kontrol Et
1. Chrome DevTools aç (F12)
2. Console tab'ına git
3. Network tab'ını aç
4. Form submit et
5. İncele:
   - Request payload doğru mu?
   - Response 200 OK mi?
   - Response body'de data var mı?
   - Frontend error var mı?

### 3. Database Kontrol Et

**Vercel Postgres ise:**
```bash
# Vercel dashboard'dan SQL Editor aç
SELECT * FROM "Client" ORDER BY "createdAt" DESC LIMIT 10;
SELECT * FROM "Event" ORDER BY "createdAt" DESC LIMIT 10;
SELECT * FROM "Transaction" ORDER BY "createdAt" DESC LIMIT 10;
```

**Neon.tech ise:**
- Neon.tech dashboard > Tables > Query Editor

## 🐛 Bilinen Sorunlar ve Çözümleri

### Sorun 1: Activity Logger Undefined Values
**Durum:** ✅ ÇÖZÜLDÜ

**Neden:** Fonksiyon çağrısı yanlış parametrelerle yapılıyordu.

**Çözüm:**
```typescript
// Eski (YANLIŞ):
await logActivity(userId, "ACTION", "details");

// Yeni (DOĞRU):
await logActivity({
  userId: session.user.id,
  action: "CREATE",
  entity: "CLIENT",
  entityId: client.id,
  details: "Details here",
});
```

### Sorun 2: Null Value Handling
**Durum:** ✅ ÇÖZÜLDÜ

**Çözüm:** Event API'de null values düzgün handle ediliyor:
```typescript
description: description || null,  // undefined yerine null
location: location || null,
color: color || null,
taskId: taskId || null,
```

### Sorun 3: Prisma Client Connection
**Durum:** ✅ OPTİMİZE EDİLDİ

**Çözüm:**
- Production'da query logging kapatıldı
- Connection pooling iyileştirildi
- Graceful disconnect eklendi

## 🔍 Test Senaryoları

### Test 1: Müşteri Ekleme
```bash
# 1. Müşteri ekle
# 2. Console'da kontrol et:
#    - "Client POST request body:" log'u var mı?
#    - "Client created:" log'u var mı?
#    - Response 200 mü?
# 3. Database kontrol et:
#    SELECT * FROM "Client" ORDER BY "createdAt" DESC LIMIT 1;
# 4. Frontend kontrol et:
#    - Toast notification göründü mü?
#    - Liste yenilendi mi?
```

### Test 2: Takvim Event Ekleme
```bash
# 1. Event ekle
# 2. Console'da kontrol et:
#    - "Event POST request body:" log'u var mı?
#    - "Event created:" log'u var mı?
# 3. Database kontrol et:
#    SELECT * FROM "Event" ORDER BY "createdAt" DESC LIMIT 1;
# 4. Takvimde görünüyor mu?
```

## 🚨 Acil Hata Çözümleri

### Error: "Internal server error"
**Adımlar:**
1. Vercel logs aç: `vercel logs --follow`
2. Hatayı bul
3. Eğer database hatası ise:
   - DATABASE_URL doğru mu kontrol et
   - Prisma generate çalıştır: `npx prisma generate`
   - Redeploy: `vercel --prod`

### Error: "Unauthorized"
**Adımlar:**
1. NEXTAUTH_SECRET doğru mu?
2. NEXTAUTH_URL production URL'i mi?
3. Session var mı? (Console'da `console.log(session)`)
4. Logout/Login dene

### Error: Validation failed
**Adımlar:**
1. Network tab'da request payload'a bak
2. Hangi field eksik/yanlış?
3. Frontend validation ekle
4. Backend validation mesajını oku

## 📊 Environment Variables Checklist

Vercel Dashboard > Settings > Environment Variables:

```env
✅ NODE_ENV=production
✅ DATABASE_URL=postgresql://...?sslmode=require  (SSL MODE!)
✅ NEXTAUTH_URL=https://your-app.vercel.app
✅ NEXTAUTH_SECRET=[32+ karakter]
```

**Kritik:** DATABASE_URL sonunda `?sslmode=require` olmalı!

## 🔄 Redeploy Prosedürü

Eğer hiçbir şey işe yaramazsa:

```bash
# 1. Local'de test et
npm run build
npm start
# Test et, çalışıyor mu?

# 2. Git commit & push
git add .
git commit -m "fix: database issues"
git push origin main

# 3. Vercel otomatik deploy eder
# Veya manuel:
vercel --prod

# 4. Database migration (eğer schema değişti ise)
# Vercel dashboard > Deployments > Latest > Runtime Logs
# veya
vercel env pull .env.production
npx prisma migrate deploy
```

## 🎯 Frontend Debug

### Müşteri Sayfası:
```typescript
// app/(dashboard)/musteriler/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log("Form gönderiliyor:", formData);  // ✅ VAR
  
  const response = await fetch("/api/clients", {...});
  
  console.log("Response status:", response.status);  // ✅ VAR
  const data = await response.json();
  console.log("Response data:", data);  // ✅ VAR
  
  if (response.ok) {
    await fetchClients();  // ✅ Liste yenileniyor
  }
}
```

**Kontrol Et:**
1. Form submit oluyor mu?
2. Response 200 mü?
3. Response data var mı?
4. fetchClients() çağrılıyor mu?
5. Liste güncellenmiyor mu?

### Olası Sorun: Cache
```typescript
// Force refresh ekle
const fetchClients = async () => {
  const response = await fetch("/api/clients", {
    cache: 'no-store',  // EKLE
    headers: {
      'Cache-Control': 'no-cache',  // EKLE
    }
  });
  // ...
}
```

## 📱 Network Tab Analizi

### Başarılı Request:
```
POST /api/clients
Status: 200 OK
Response: {
  "id": "...",
  "name": "...",
  "email": "...",
  ...
}
```

### Başarısız Request:
```
POST /api/clients
Status: 500 Internal Server Error
Response: {
  "error": "Internal server error: ..."
}
```

## 🎪 Test URL'leri

Vercel'de deploy sonrası:
```
https://your-app.vercel.app/musteriler
https://your-app.vercel.app/takvim
https://your-app.vercel.app/projeler
```

Her birini test et:
- ✅ Sayfa açılıyor mu?
- ✅ Veri listeleniyor mu?
- ✅ Ekleme çalışıyor mu?
- ✅ Toast gösteriliyor mu?

## 💡 İpuçları

1. **Vercel Logs her zaman açık tut**
   ```bash
   vercel logs --follow
   ```

2. **Browser Console her zaman açık tut**
   - F12 → Console
   - F12 → Network

3. **Database'i sık kontrol et**
   - Her form submit sonrası
   - SELECT query'leri çalıştır

4. **Cache sorunları olabilir**
   - Hard refresh: Ctrl + Shift + R
   - Incognito mode dene
   - Cache temizle

5. **Environment Variables değişirse**
   - Redeploy gerekli
   - Vercel dashboard'dan değiştir
   - Veya: `vercel env pull` → `vercel --prod`

## 🆘 Hala Çalışmıyor mu?

### Debug Modu Aktif Et:

**1. Client API'de:**
```typescript
// app/api/clients/route.ts
export async function POST(request: Request) {
  console.log("=== CLIENT POST START ===");
  console.log("Session:", session);
  console.log("Body:", body);
  console.log("Creating client...");
  const client = await prisma.client.create({...});
  console.log("Client created:", client);
  console.log("=== CLIENT POST END ===");
  return NextResponse.json(client);
}
```

**2. Frontend'de:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  console.log("=== FORM SUBMIT START ===");
  console.log("Form data:", formData);
  
  const response = await fetch("/api/clients", {...});
  
  console.log("Response:", response.status, await response.clone().text());
  console.log("=== FORM SUBMIT END ===");
}
```

**3. Vercel Logs:**
```bash
vercel logs --follow
# Bu logları göreceksin
```

---

## ✅ Çözüm Kontrol Listesi

- [ ] Vercel logs temiz mi? (error yok)
- [ ] Browser console temiz mi? (error yok)
- [ ] Database'de yeni kayıtlar var mı?
- [ ] Response status 200 mü?
- [ ] Response body'de data var mı?
- [ ] Toast notification gösteriliyor mu?
- [ ] Liste güncelleniyor mu?
- [ ] Environment variables doğru mu?
- [ ] DATABASE_URL'de sslmode=require var mı?
- [ ] Prisma client güncel mi?

Hepsi ✅ ise sistem çalışıyor demektir!
