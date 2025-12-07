// Şirket ve uygulama ayarları
export const APP_CONFIG = {
  // Uygulama bilgileri
  name: "Fikir Creative OS", // Buraya yeni isim gelecek
  shortName: "FC", // Logo için kısaltma
  description: "Şirket içi yönetim sistemi",
  
  // Şirket bilgileri
  company: {
    name: "Fikir Creative",
    domain: "fikircreative.com",
    email: "@fikircreative.com", // Email domain kısıtlaması
  },
  
  // Logo ayarları
  logo: {
    // Logo URL buraya eklenecek
    url: null, // "/logo.png" gibi
    text: "FC", // Logo yerine gösterilecek text
    showText: true, // Logo yerine text göster
  },
  
  // Renk teması
  theme: {
    primary: "#dc2626", // red-600
    secondary: "#ea580c", // orange-600
  }
};
