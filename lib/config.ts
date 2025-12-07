// Şirket ve uygulama ayarları
export const APP_CONFIG = {
  // Uygulama bilgileri
  name: "Fikir Creative", // Uygulama ismi
  shortName: "FC", // Logo için kısaltma
  description: "Şirket İçi Yönetim Sistemi",
  
  // Şirket bilgileri
  company: {
    name: "Fikir Creative",
    domain: "fikircreative.com",
    email: "@fikircreative.com", // Email domain kısıtlaması
  },
  
  // Logo ayarları - dark theme için
  logo: {
    sidebar: "/logos/logo-white.png", // Sidebar için beyaz logo
    login: "/logos/logo-color.png",   // Login sayfası için renkli logo
    icon: "/logos/logo-dark.png",     // Favicon için
    text: "FC", // Fallback text
    showText: false, // Logo dosyası kullan
    width: 32,  // Sidebar logo genişliği
    height: 32, // Sidebar logo yüksekliği
  },
  
  // Renk teması
  theme: {
    primary: "#dc2626", // red-600
    secondary: "#ea580c", // orange-600
  }
};
