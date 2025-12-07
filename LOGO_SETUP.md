# 🎨 Logo Kurulum Talimatları

## Adım 1: Logo Dosyalarını Kaydet

Aşağıdaki 3 logo dosyasını `public/logos/` klasörüne kaydedin:

### 1. Renkli Logo (Kırmızı Gradient)
- **Dosya adı:** `logo-color.png`
- **Kullanım:** Login sayfası, light background
- **Boyut:** 500x500 px (önerilen)

### 2. Beyaz Logo
- **Dosya adı:** `logo-white.png`
- **Kullanım:** Sidebar, dark background
- **Boyut:** 200x200 px (önerilen)

### 3. Siyah Logo
- **Dosya adı:** `logo-dark.png`
- **Kullanım:** Favicon, light background (opsiyonel)
- **Boyut:** 200x200 px (önerilen)

## Adım 2: Logoları Kopyala

```powershell
# PowerShell'de çalıştır (indirilenler klasöründen)
Copy-Item "logo-renkli.png" -Destination "C:\Users\Oğuzhan Çankaya\Desktop\FikirCreative\public\logos\logo-color.png"
Copy-Item "logo-beyaz.png" -Destination "C:\Users\Oğuzhan Çankaya\Desktop\FikirCreative\public\logos\logo-white.png"
Copy-Item "logo-siyah.png" -Destination "C:\Users\Oğuzhan Çankaya\Desktop\FikirCreative\public\logos\logo-dark.png"
```

## Adım 3: Commit & Deploy

```powershell
cd "C:\Users\Oğuzhan Çankaya\Desktop\FikirCreative"
git add public/logos/
git commit -m "feat: add Fikir Creative logos"
git push origin main
```

## ✅ Sonuç

Logolar kaydedildikten sonra:
- ✅ Sidebar'da beyaz logo görünecek
- ✅ Login sayfasında renkli logo görünecek
- ✅ Uygulama ismi "Fikir Creative" olarak güncellenecek

---

**Not:** Eğer logolar görünmüyorsa, tarayıcı cache'ini temizle (Ctrl + Shift + R)
