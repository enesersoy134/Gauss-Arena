# 📚 İşler Akademi — 1v1 Soru Düellosu, Momentum Tabanlı Eşleştirme ve Ödül Ekonomisi

Bu proje, **İşler Hackathon** kapsamında geliştirilmiş; öğrencilerin **TYT** ve **AYT** derslerindeki soru çözme pratiğini gerçek zamanlı bir **1v1 bilgi düellosuna** dönüştüren, **Momentum Tabanlı Efektif MMR ($MMR_{eff}$)** eşleştirme motoru ve **İşler Sadakat Puanı** ödül ekonomisi içeren uçtan uca bir oyun prototipidir.

---

## 🎯 Çözülen Temel Problemler

Standart ELO tabanlı eşleştirme sistemlerinde gerçek ödül (kitap indirimi) bulunduğunda üç kritik suistimal ortaya çıkar:
1. **Kolay Rakip Sömürüsü (Farming):** Bir oyuncunun kendisinden düşük seviyedeki rakipleri sürekli yenerek haksız ELO ve ödül toplaması.
2. **Smurfing:** Alt ligde başlayan güçlü bir oyuncunun gerçek seviyesine çıkana kadar alt ligdeki oyuncuların deneyimini bozması.
3. **Win-Trading, ELO Park Etme ve Bot/Kopya Suistimali:** İki arkadaşın gece saatlerinde sürekli birbirleriyle eşleşip maç satması, yüksek ELO'ya çıkıp hiç maç yapmadan her hafta ödül toplaması veya soru metinlerini kopyalayıp yapay zekaya çözdürmesi.

---

## 🧠 Sistem Mimarisi ve Matematiksel Modeller

### 1. Momentum Tabanlı Eşleştirme Modeli (Effective MMR)

Eşleştirme kuyruğunda (queue) oyuncunun yalnızca görünür ELO'suna değil, yakaladığı galibiyet/mağlubiyet serisine ($S$) dayalı **Efektif MMR ($MMR_{eff}$)** değerine bakılır:

$$MMR_{eff} = R_{mevcut} + \text{sgn}(S) \cdot \alpha \cdot (\max(0, |S| - 2))^\beta$$

- **$R_{mevcut}$:** Oyuncunun gerçek (görünür) ELO puanı (Başlangıç: `1200`).
- **$S$:** Seri sayacı (Üst üste 5 galibiyette $+5$, üst üste 4 mağlubiyette $-4$). İlk 2 maçlık seri normal kabul edildiğinden $|S| \le 2$ için momentum etkisi $0$'dır.
- **$\alpha = 35$, $\beta = 1.2$:** Momentum ivmelendirme katsayıları.
  - *Örnek:* `1200 ELO` puanındaki bir oyuncu üst üste 5 maç kazandığında ($S = +5$), kuyrukta **$MMR_{eff} \approx 1331.19$** puanlı bir oyuncu gibi aranır ve ya gerçekten `1330–1350 ELO` bandındaki sağlam bir rakiple ya da kendisi gibi yüksek momentumlu başka bir oyuncuyla eşleşir.

### 2. Maç Sonu Gerçek ELO Değişimi, Smurf Hızlandırma ve Anti-Farming

Maç bittiğinde kazanılacak/kaybedilecek ELO puanı hesaplanırken $MMR_{eff}$ değil, oyuncuların **gerçek ELO değerleri ($R_A$ ve $R_B$)** kullanılır ($K = 32$):

$$E_A = \frac{1}{1 + 10^{(R_B - R_A) / 400}}, \quad R'_A = R_A + K \cdot (S_{skor} - E_A)$$

- **Smurf Hızlandırma:** Düşük gerçek ELO'lu ama yüksek momentumlu oyuncu ($1200\text{ ELO}, S=+5$), $MMR_{eff}$ sayesinde üst ELO'lu ($1340\text{ ELO}$) rakiple eşleşip onu yendiğinde $E_A$ düşük olduğu için tek maçta yüksek puan (**$\approx +22.1\text{ ELO}$**) alarak hızla üst lige taşınır.
- **Gerçek ELO Farkı Sönümlemesi (Anti-Farming):** Gerçek ELO farkı $|R_A - R_B| > 250$ olduğunda yüksek ELO'lu oyuncu kazanırsa azalan verim çarpanı devreye girer ve kazanç **maksimum $+1\text{ ELO}$** ($\Delta R \ge 300$ ise **$0\text{ ELO}$**) ile sınırlandırılır.

### 3. Genişleyen Pencere (Expanding Window) Kuyruk Algoritması

İki oyuncunun eşleşebilmesi için **aynı sınav tipini (`TYT` veya `AYT`)** seçmiş olmaları ve seçtikleri ders kümelerinin **en az bir ortak derste kesişmesi ($Subjects_A \cap Subjects_B \neq \emptyset$)** gerekir.

| Kuyrukta Geçen Süre | $\Delta MMR_{eff}$ Arama Aralığı | Momentum ($\Delta S$) Toleransı | Maksimum Gerçek ELO Farkı ($\Delta R$) |
| :--- | :--- | :--- | :--- |
| **0 – 5 Saniye** | $\pm 50$ Puan | $\pm 1$ Seri farkı | $\pm 100$ Puan |
| **5 – 15 Saniye** | $\pm 100$ Puan | $\pm 3$ Seri farkı | $\pm 175$ Puan |
| **15 – 30 Saniye** | $\pm 175$ Puan | Kısıtlama kalkar | $\pm 250$ Puan (Sert Sınır) |
| **> 30 Saniye** | **Ghost (Asenkron) Rakip** | Oyuncunun ELO/MMR seviyesine uygun geçmiş oyuncu kaydı devreye girer |

### 4. 5 Soruluk Düello Mekaniği ve Beraberlik Bozucu (Tie-Breaker) Puanlama

- **ELO Bazlı Soru Zorluğu Dağılımı:** Ortak seçilen derslerin havuzundan maçın ortalama ELO'suna ($\bar{R}$) göre 5 soru çekilir:
  - **Başlangıç Bandı ($\bar{R} < 1200$):** 3 Kolay (`EASY`), 2 Orta (`MEDIUM`)
  - **Orta Bant ($1200 \le \bar{R} \le 1600$):** 1 Kolay (`EASY`), 3 Orta (`MEDIUM`), 1 Zor (`HARD`)
  - **Üst Bant ($\bar{R} > 1600$):** 1 Orta (`MEDIUM`), 4 Zor (`HARD`)
- **Doğruluk + Çözüm Hızı Puanlaması (Her soru 60 sn):**
  $$\text{Soru Puanı} = \text{Doğru mu (0 veya 1)} \times \left(100 + 50 \times \frac{\text{Kalan Süre}}{\text{Toplam Süre}}\right)$$
  Yanlış cevapta hız puanı sıfırlanır ($0$ puan). Böylece rastgele şık işaretlemenin önüne geçilirken, eşit doğru sayısında soruları daha hızlı çözen oyuncu düelloyu kazanır.

### 5. Ödül Ekonomisi (İşler Sadakat Puanı) ve Güvenlik Katmanları

- **İkili Eşleşme Soğuma Süresi (Pairwise Cooldown):** İki spesifik oyuncu ($Oyuncu_A$ ve $Oyuncu_B$) son 24 saat içinde birbirleriyle **en fazla 2 kez** puanlı maç yapabilir (Win-Trading engeli).
- **Aktiflik ve Minimum Maç Şartı:** Haftalık ELO dilimine göre verilen Coin ödülünü (`100` – `1250 Coin`) talep edebilmek için o hafta **en az 15 maç tamamlama** şartı aranır.
- **Coin → İşler Sadakat Puanı Dönüşümü:** Kazanılan Coin'ler `10 Coin = 1 İşler Sadakat Puanı (1 TL Kitap İndirimi)` oranıyla anında indirim kuponuna (`ISLER-...`) dönüştürülebilir.
- **Haftalık Turnuvalar:** Aktif TYT ve AYT haftalık turnuvalarında katılımcılar turnuva havuzunda eşleşir ve sıralamaya göre ödül havuzundan pay alır.
- **Anti-Bot / Canvas Soru Sunumu:** Soru metinleri ve LaTeX matematik ifadeleri (`$$...$$`) istemciye kopyalanabilir DOM metni olarak değil, sağ tık korumalı ve filigranlı **HTML5 `<canvas>`** üzerinde çizilerek sunulur.

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js** (v18 veya üzeri; harici veritabanı veya Redis kurulumu gerektirmez)

### Adımlar

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. (Opsiyonel) Soru havuzundaki tüm TYT/AYT ders ve zorluk dosyalarını tohumlayın
npm run seed

# 3. Birim ve entegrasyon testlerini çalıştırın
npm test

# 4. Yerel sunucuyu başlatın (Varsayılan port: 3000)
npm start
```

---

## 🖥️ Bilgisayarda İki Farklı Pencereden Canlı Test Rehberi

Sunucu çalıştığında (`http://localhost:3000`) bilgisayarda iki ayrı tarayıcı penceresi açarak iki farklı oyuncuyla canlı eşleşme ve düello yapabilirsiniz:

1. **1. Pencereyi Açın:** [http://localhost:3000/?window=1&player=p2](http://localhost:3000/?window=1&player=p2)  
   *(Varsayılan olarak **Zeynep Kaya** seçili gelir: `1200 ELO`, `S = +5 Seri`, `MMR_eff = 1331.19`)*
2. **2. Pencereyi Açın:** Sağ üstteki **"🗗 2. Test Penceresini Aç"** butonuna tıklayın veya yeni bir pencerede [http://localhost:3000/?window=2&player=p3](http://localhost:3000/?window=2&player=p3) adresine gidin.  
   *(Varsayılan olarak **Mert Demir** seçili gelir: `1340 ELO`, `S = +1 Seri`, `MMR_eff = 1340`)*

### Deneyebileceğiniz Demo Senaryoları

- **Senaryo A — Smurf / Yüksek Momentum Eşleşmesi:**
  - Pencere 1'de `Zeynep (1200 ELO, S=+5, MMR=1331)` ve Pencere 2'de `Mert (1340 ELO, S=+1, MMR=1340)` seçiliyken her iki pencerede de **"🚀 Eşleştir (Kuyruğa Gir)"** butonuna basın.
  - Sağdaki **Canlı Kuyruk & Momentum Müfettişi** panelinde ilk 0–15 saniyede seri farkı ($\Delta S = 4$) nedeniyle beklediklerini, **15. saniyede** (veya **"⏩ Kuyruk Süresini +5sn Hızlandır"** butonuna bastığınızda) $MMR_{eff}$ değerleri birbirine çok yakın ($\Delta MMR = 8.81 \le 175$) olduğu için eşleştiklerini gözlemleyin.
- **Senaryo B — İkili Eşleşme Soğuma Süresi (Win-Trading Koruması):**
  - Aynı iki oyuncuyla üst üste 2 maç tamamladıktan sonra 3. kez kuyruğa girin. Müfettiş panelinde `24 saatlik ikili maç sınırı doldu (2/2 - Win-Trading Koruması)` uyarısıyla eşleşmenin engellendiğini görün.
- **Senaryo C — 30 Saniye Sonu Ghost (Asenkron) Rakip:**
  - Tek bir pencereden kuyruğa girip **"⏩ Kuyruk Süresini +5sn Hızlandır"** butonuna birkaç kez basarak süreyi 30 saniyeye ulaştırın; sistemin oyuncunun ELO'suna uygun **Hayalet Rakip (Asenkron Kayıt)** ile düelloyu başlattığını görün.
- **Senaryo D — Haftalık 15 Maç Şartı ve İşler Sadakat Puanı Dönüşümü:**
  - **"🪙 Haftalık Coin & İşler Sadakat Puanı"** sekmesine geçin. **"⚡ Demo: Haftalık Maç Sayısını 15/15 Yap"** butonuna basıp haftalık ELO ödülünüzü alın ve Coin'lerinizi **İşler Sadakat Puanı** indirim kuponuna dönüştürün.

---

## 📂 Proje Klasör Yapısı

```text
├── question-bank/                 # TYT ve AYT (Matematik, Fizik, Kimya, Türkçe) Kolay/Orta/Zor JSON soru havuzu (144 soru)
├── scripts/
│   └── seedQuestionBank.js        # Soru havuzu tohumlama betiği
├── src/
│   ├── engine/
│   │   ├── eloMomentum.js         # MMR_eff, Gerçek ELO, Anti-Farming, Seri ve Soru Hız/Doğruluk puanlama formülleri
│   │   ├── questionBank.js        # Soru havuzu yükleyici ve ELO bandına göre 5 soru seçici
│   │   ├── matchmakingQueue.js    # Genişleyen pencere (0-5s, 5-15s, 15-30s), 24s Cooldown ve Ghost rakip motoru
│   │   ├── duelSession.js         # 5 soruluk gerçek zamanlı düello durum makinesi
│   │   └── economyTournaments.js  # Haftalık ELO dilimleri, 15 maç şartı, Coin -> İşler Puanı ve Haftalık Turnuvalar
│   └── server.js                  # Express REST API + Socket.IO gerçek zamanlı sunucu
├── public/
│   ├── index.html                 # Çift pencereli test arayüzü
│   ├── styles.css                 # Arayüz stilleri
│   ├── canvasQuestion.js          # Anti-Bot HTML5 Canvas soru ve LaTeX matematik çizici
│   └── app.js                     # İstemci tarafı Socket.IO, Kuyruk Müfettişi ve Düello kontrolcüsü
└── tests/                         # Birim ve entegrasyon testleri (node:test)
```
