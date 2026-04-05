
# 🍽️ Yemek Tarifi Bulma Uygulaması

Bulut Bilişim dersi kapsamında geliştirdiğim, çift katmanlı web uygulaması.  
Kullanıcılar malzeme girerek yemek tarifleri seçebilir, kategoriye ve ülkeye göre filtreleyebilir.
## 🌐 Canlı Bağlantılar

- **YOUTUBE:** https://youtu.be/emW6e9g5VMo
---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python, Flask
| Frontend | React.js |
| Harici API | TheMealDB API |
| Bulut (Backend) | AWS EC2 (Amazon Linux 2023) |
| Bulut (Frontend) | AWS S3 (Statik Web Sitesi) |
| Versiyon Kontrol | Git, GitHub |

---

## 📁 Proje Yapısı
```
yemek-tarifi-app/
├── backend/
│   └── app.py          # Flask API
├── frontend/
│   ├── src/
│   │   └── App.js      # React uygulaması
│   └── build/          # Production build
└── README.md
```

---

## ⚙️ API Endpoint'leri

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/saglik` | GET | API sağlık kontrolü |
| `/api/search?malzeme=chicken` | GET | Malzemeye göre tarif ara |
| `/api/detay/<id>` | GET | Tarif detayını getir |
| `/api/kategori/<kategori>` | GET | Kategoriye göre tarif listele |
| `/api/ulke/<ulke>` | GET | Ülkeye göre tarif listele |
| `/api/rastgele` | GET | Rastgele tarif getir |

---

## 🚀 Özellikler

- 🔍 Malzemeye göre tarif arama (Türkçe/İngilizce)
- 🌍 Türkçe malzeme desteği (otomatik çeviri)
- 📂 Kategoriye göre filtreleme
- 🌎 Ülkeye göre filtreleme
- 🎲 Rastgele tarif önerisi
- 🥕 Malzeme listesi görüntüleme
- 🌐 Google Translate entegrasyonu
- 🇹🇷/🇬🇧 Türkçe/İngilizce dil desteği

---

## ☁️ AWS Mimarisi
```
Kullanıcı → S3 (React Frontend) → EC2 (Flask Backend) → TheMealDB API
```

- **AWS S3:** Frontend dosyaları statik web sitesi olarak barındırılıyor
- **AWS EC2:** Flask backend API sunucusu olarak çalışıyor (t3.micro, Amazon Linux 2023)
- **Güvenlik Grubu:** Port 80 (HTTP) ve Port 22 (SSH) açık

## 👩‍💻 Geliştirici

**Yagmur Kalyoncu**  
Bulut Bilişim Dersi - Proje 1  
2026
