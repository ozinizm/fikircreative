# 🚀 Vercel Deployment Rehberi

## ✅ 1. Adım: Giriş Tamamlandı!

Vercel hesabınıza giriş yaptınız.

---

## 📊 2. Adım: Database Seçimi

Vercel'de **iki seçenek** var:

### Seçenek A: Vercel Postgres (Önerilen - Kolay)
- Ücretsiz 256MB
- Otomatik entegrasyon
- Setup: `npx vercel link` sonrası Vercel dashboard'dan ekle

### Seçenek B: Mevcut MySQL'i Kullan
- cPanel MySQL'inizi uzaktan erişime açın
- DATABASE_URL'i Vercel environment variables'a ekleyin

**Hangi seçeneği tercih edersiniz?**

---

## 🎯 3. Adım: Deploy Komutu

### Vercel Postgres ile (Seçenek A):
```bash
# Projeyi Vercel'e bağla
npx vercel link

# Environment variables ekle (Vercel dashboard)
DATABASE_URL = (Vercel Postgres otomatik verecek)
NEXTAUTH_SECRET = 102feac22e1c35d48ef3f4e233187a9c87119ba8dc99ad017f0a6bb205395e00

# Deploy
npx vercel --prod
```

### Mevcut MySQL ile (Seçenek B):
```bash
# Deploy
npx vercel --prod

# Environment variables (Vercel dashboard'dan ekle):
DATABASE_URL = mysql://fikircre_agencyos_user:A244466666a.!@SUNUCU_IP:3306/fikircre_agencyos
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = 102feac22e1c35d48ef3f4e233187a9c87119ba8dc99ad017f0a6bb205395e00
```

---

## 🔗 4. Custom Domain (panel.fikircreative.com)

Deploy sonrası Vercel Dashboard'da:
1. Project → Settings → Domains
2. "panel.fikircreative.com" ekle
3. DNS kayıtlarını güncelle (cPanel'de):
   ```
   Type: CNAME
   Name: panel
   Value: cname.vercel-dns.com
   ```

---

## 🎬 Şimdi Ne Yapmalı?

Hangi database yolunu seçersiniz?
- **Kolay yol:** Vercel Postgres (yeni, ücretsiz)
- **Mevcut MySQL:** cPanel'deki database'i kullan (remote access açmalı)

Kararınızı söyleyin, devam edelim! 🚀
