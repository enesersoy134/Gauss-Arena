# Isler-Hackathon (İşler 1v1 Düello & Momentum Eşleştirme Arenası)

## Kurulum

Bağımlılıkları yüklemek için:

```bash
npm install
```

## Geliştirme Ortamında Çalıştırma (Görsel Arayüz + Backend)

Uygulamayı yerel ortamda çalıştırmak için iki ayrı terminalde arka uç (API + Socket.IO) ve ön yüz (Vite React) sunucularını başlatın:

**1. Terminal — Backend Sunucusu (`http://localhost:3000`):**
```bash
npm run dev:server
```

**2. Terminal — Frontend Sunucusu (`http://localhost:5173`):**
```bash
npm run dev:client
```

### Tarayıcıda Test Adresleri

- **Ana Arayüz:** `http://localhost:5173/`
- **1v1 Karşılıklı Düello Testi (İki Ayrı Sekme/Pencere):**
  - **Pencere 1 (Oyuncu 1):** `http://localhost:5173/?window=1&player=p2`
  - **Pencere 2 (Oyuncu 2):** `http://localhost:5173/?window=2&player=p3`

## Diğer Komutlar

- **Birim ve Entegrasyon Testlerini Çalıştırma:**
  ```bash
  npm test
  ```
- **Production Build Alma ve Tek Sunucuda Çalıştırma (`http://localhost:3000`):**
  ```bash
  npm run build
  npm start
  ```
- **Soru Bankasını Yeniden Oluşturma (Seed):**
  ```bash
  npm run seed
  ```
