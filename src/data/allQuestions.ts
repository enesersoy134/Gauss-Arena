import { Question } from '../types/game';
import { ALL_INTERACTIVE_QUESTIONS } from './allInteractiveQuestions';

export { ALL_INTERACTIVE_QUESTIONS };

export const ALL_QUESTIONS: Question[] = [
  {
    "id": "AYT-BIY-E-001",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Sinir Sistemi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsanda denge ve kas koordinasyonunu sağlayan arka beyin bölümü aşağıdakilerden hangisidir?",
    "explanation": "Beyincik (hayat ağacı), iç kulaktaki yarım daire kanalları ve gözden gelen bilgilerle kas dengesini sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Talamus",
        "Hipotalamus",
        "Beyincik",
        "Omurilik soğanı"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-002",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Endokrin Sistem",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kandaki glikoz düzeyi normalin üzerine çıktığında pankreasın Beta hücrelerinden salgılanarak kan şekerini düşüren hormon hangisidir?",
    "explanation": "İnsülin glikozun hücrelere geçişini ve karaciğerde glikojen olarak depolanmasını sağlayarak kan şekerini düşürür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Glukagon",
        "İnsülin",
        "Adrenalin",
        "Tiroksin"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-003",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Dolaşım Sistemi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsan kalbinde temiz (oksijence zengin) kanı tüm vücuda pompalayan kalp odacığı hangisidir?",
    "explanation": "Sol karıncık kasıldığında temiz kan aort atardamarı ile tüm vücuda pompalanır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sağ kulakçık",
        "Sağ karıncık",
        "Sol kulakçık",
        "Sol karıncık"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-004",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Solunum Sistemi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsan akciğerlerinde gaz alışverişinin (O₂ ve CO₂ difüzyonunun) gerçekleştiği kılcal damarlarla çevrili hava keseciklerine ne ad verilir?",
    "explanation": "Alveoller akciğerlerde solunum yüzeyini genişleten tek katlı yassı epitelden oluşmuş hava kesecikleridir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Bronş",
        "Alveol",
        "Trake",
        "Diyafram"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-005",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Üriner Sistem (Boşaltım)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsan böbreğinin yapı ve görev birimi aşağıdakilerden hangisidir?",
    "explanation": "Böbrekte süzülme, geri emilim ve salgılama olaylarını gerçekleştiren yapı birimi nefrondur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Nöron",
        "Nefron",
        "Alveol",
        "Sarkomer"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-006",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Genden Proteine",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "DNA'daki genetik şifrenin mRNA molekülüne aktarılması (yazılması) olayına ne ad verilir?",
    "explanation": "DNA üzerinden mRNA sentezlenmesi olayına transkripsiyon (yazılım) denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Replikasyon",
        "Transkripsiyon",
        "Translasyon",
        "Mutasyon"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-007",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Fotosentez",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yeşil bitkilerde fotosentezin ışığa bağımlı tepkimeleri kloroplastın hangi kısmında gerçekleşir?",
    "explanation": "Klorofil pigmentleri tilakoit zarlarda (granumlarda) bulunduğundan ışığa bağımlı evre burada gerçekleşir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Stroma sıvısında",
        "Tilakoit zarda (Grana)",
        "Dış zarda",
        "Sitoplazmada"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-008",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Bitki Biyolojisi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bitkilerde kökten alınan su ve suda çözünmüş mineralleri yapraklara taşıyan iletim dokusu hangisidir?",
    "explanation": "Ksilem (odun boruları) su ve mineralleri kökten üst organlara tek yönlü taşır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Floem (Soymuk borusu)",
        "Ksilem (Odun borusu)",
        "Kambiyum",
        "Stoma"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-009",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Duyu Organları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsan gözünde fotoreseptörlerin (koni ve çomak hücrelerinin) bulunduğu ve görüntünün oluştuğu iç tabaka hangisidir?",
    "explanation": "Fotoreseptörler ve sarı benek gözün en iç tabakası olan ağ tabakada (retinada) yer alır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sert tabaka (Sklera)",
        "Damar tabaka (Koroid)",
        "Ağ tabaka (Retina)",
        "Kornea"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-E-010",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Destek ve Hareket Sistemi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Çizgili kasların kasılma birimi olan iki Z çizgisi arasındaki bölgeye ne ad verilir?",
    "explanation": "İki Z çizgisi arasında kalan aktin ve miyozin ipliklerinden oluşan kasılma birimine sarkomer denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sarkolemma",
        "Sarkomer",
        "Periost",
        "Osteon"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-001",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Kas Kasılması (Huxley Kayan İplikler)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Çizgili bir kasın kasılması sırasında aşağıdakilerden hangisi gerçekleşmez?",
    "explanation": "Miyozin ipliklerinin boyuna karşılık gelen A bandının boyu kasılma ve gevşeme sırasında değişmez.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Z çizgileri birbirine yaklaşır",
        "H bandı daralır ve kaybolur",
        "A bandının boyu kısalır",
        "I bandı daralır"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-002",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Starling Hipotezi (Kılcal Damar Madde Alışverişi)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Kılcal damar boyunca kan basıncı azalırken kanın osmotik basıncı sabit kalır. Kan basıncının osmotik basınçtan büyük olduğu atardamar ucunda hangi olay gerçekleşir?",
    "explanation": "Atardamar ucunda kan basıncı (≈32 mmHg) > osmotik basınç (≈22 mmHg) olduğundan kandan doku sıvısına madde süzülmesi olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Doku sıvısından kana geri emilim",
        "Kandan doku sıvısına süzülme",
        "Lenf akışının durması",
        "Plazma proteinlerinin dışarı çıkması"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-003",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Oksijenli Solunum Basamakları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Oksijenli solunumda substrat düzeyinde fosforilasyon (SDF) hangi evrelerde gerçekleşir?",
    "explanation": "Substrat düzeyinde fosforilasyon (SDF) sitoplazmada glikolizde ve mitokondri matriksinde Krebs döngüsünde görülür; ETS evresinde oksidatif fosforilasyon gerçekleşir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yalnızca ETS",
        "Glikoliz ve Krebs döngüsü",
        "Yalnızca Krebs döngüsü",
        "Glikoliz ve ETS"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-004",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "DNA Replikasyonu (Meselson-Stahl)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Ağır azotlu (¹⁵N¹⁵N) bir DNA molekülü normal azotlu (¹⁴N) ortamda 3 kez eşlendiğinde oluşan DNA moleküllerinden kaç tanesi melez (¹⁵N¹⁴N) olur?",
    "explanation": "Yarı korunumlu eşlenmede kaç kez eşlenirse eşlensin başlangıçtaki 2 ağır zincir korunduğu için her zaman 2 tane melez DNA oluşur (toplam 2³ = 8 DNA içinde 2 melez, 6 normal).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "4",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-005",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Fotosentez Evreleri (Calvin Döngüsü)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Fotosentezin ışıktan bağımsız tepkimelerinde (Calvin döngüsünde) CO₂ molekülünün tutulmasını (karbon fiksasyonunu) katalizleyen enzim hangisidir?",
    "explanation": "Ribuloz bisfosfat karboksilaz (Rubisco) enzimi Calvin döngüsünde CO₂ yakalanmasını sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "DNA polimeraz",
        "Rubisco",
        "Katalaz",
        "Helikaz"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-006",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Endokrin Geri Bildirim (Feedback)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Hipofiz ön lobundan salgılanan ACTH hormonu aşağıdaki endokrin bezlerden hangisini uyarır?",
    "explanation": "ACTH (Adrenokortikotropik hormon) böbrek üstü bezinin kabuk bölgesini uyararak kortizol ve aldosteron salgısını düzenler.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tiroid bezi",
        "Böbrek üstü bezinin kabuk (korteks) bölgesi",
        "Pankreas",
        "Paratiroid bezi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-007",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Solunum Gazlarının Taşınması (Bohr Etkisi)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Doku kılcallarında CO₂ artışına bağlı olarak kan pH değerinin düşmesi sonucunda hemoglobinin oksijeni bırakma eğiliminin artmasına ne ad verilir?",
    "explanation": "Düşük pH (yüksek CO₂) ortamında hemoglobinin oksijene ilgisinin azalarak dokulara O₂ bırakmasına Bohr etkisi denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Starling etkisi",
        "Bohr kayması (Bohr etkisi)",
        "Haldane etkisi",
        "Klor kayması"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-008",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Bitkilerde Stoma Açılıp Kapanması",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bekçi (kilit) hücrelerinde potasyum (K⁺) iyonlarının ve glikozun artmasıyla osmotik basıncın yükselmesi ve komşu epidermis hücrelerinden su çekilmesi sonucunda stoma nasıl tepki verir?",
    "explanation": "Bekçi hücrelerine su girdiğinde turgor basıncı artar ve stoma açıklığı açılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Stoma kapanır",
        "Turgor basıncı artar ve stoma açılır",
        "Terleme tamamen durur",
        "Hücreler plazmolize uğrar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-009",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "İnsan Üreme Sistemi ve Menstrual Döngü",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Menstrual döngüde olgunlaşan folikülün yırtılarak yumurtanın fallopi tüpüne atılmasını (ovulasyonu) doğrudan sağlayan hipofiz hormonu hangisidir?",
    "explanation": "LH hormonunun döngünün 14. gününde pik yapması ovulasyonu (yumurtlamayı) ve korpus luteum oluşumunu sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "FSH",
        "LH (Lüteinleştirici Hormon)",
        "Östrojen",
        "Oksitosin"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-H-010",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Biyoteknoloji ve Gen Mühendisliği",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir canlıdan alınan istenilen genin plazmit vektör yardımıyla başka bir canlıya (örneğin bakteriye) aktarılmasıyla elde edilen DNA molekülüne ne ad verilir?",
    "explanation": "Farklı türlere ait DNA parçalarının birleştirilmesiyle oluşturulan yeni DNA molekülüne rekombinant DNA denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Antikodon",
        "Rekombinant DNA",
        "Kromatin iplik",
        "Okazaki parçası"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-001",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Sindirim Sistemi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İnsanda proteinlerin kimyasal sindirimi hangi organda başlar ve hangi organda tamamlanır?",
    "explanation": "Protein sindirimi midede pepsin enzimiyle başlar ve ince bağırsakta (tripsin, erepsin vb.) amino asitlere kadar tamamlanır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ağızda başlar - Midede biter",
        "Midede başlar - İnce bağırsakta biter",
        "Ağızda başlar - İnce bağırsakta biter",
        "İnce bağırsakta başlar - Kalın bağırsakta biter"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-002",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Hücresel Solunum",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Glikoliz evresi tüm canlılarda hücrenin hangi bölümünde gerçekleşir?",
    "explanation": "Glikoliz enzimleri tüm canlılarda ortak olup sitoplazmada bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mitokondri matriksi",
        "Mitokondri kristası",
        "Sitoplazma",
        "Kloroplast stroması"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-003",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Protein Sentezi ve Genetik Şifre",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Protein sentezini başlatan mRNA başlangıç kodonu ve şifrelediği amino asit hangisidir?",
    "explanation": "AUG kodonu metiyonin amino asidini şifreleyen evrensel başlangıç kodonudur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "UAA - Lösin",
        "AUG - Metiyonin",
        "UGA - Valin",
        "UAG - Serin"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-004",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Böbrek Fizyolojisi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Sağlıklı bir insanın nefron kanallarında aşağıdaki maddelerden hangisinin %100 oranı geri emildiği için idrarda hiç bulunmaz?",
    "explanation": "Sağlıklı bireylerde glikoz ve amino asitlerin tamamı proksimal tüpte aktif taşıma ile geri emilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Üre",
        "Su",
        "Glikoz ve amino asitler",
        "Sodyum iyonu"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-005",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Bitkisel Hormonlar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bitkilerde meyvelerin olgunlaşmasını hızlandıran ve gaz halinde salgılanan tek bitkisel hormon hangisidir?",
    "explanation": "Etilen gaz formundaki bitkisel hormondur ve nişastayı şekere dönüştürerek meyve olgunlaşmasını sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Oksin",
        "Sitokinin",
        "Etilen",
        "Giberellin"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-006",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Bağışıklık Sistemi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Hastalık etkeni mikroorganizmayı bizzat geçirerek veya aşı olarak antikor üretilmesi ne tür bağışıklıktır?",
    "explanation": "Bireyin kendi lenfositlerinin antijene karşı antikor ve hafıza hücresi üretmesi aktif bağışıklıktır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Pasif bağışıklık",
        "Aktif bağışıklık",
        "Doğal (Özgül olmayan) bağışıklık",
        "Serum bağışıklığı"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-007",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Popülasyon Ekolojisi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İki farklı türün aynı sınırlı besin kaynağı için mücadele etmesi hangi ekolojik ilişki türüdür?",
    "explanation": "Her iki türün de olumsuz etkilendiği (-/-) kaynak paylaşımı mücadelesine rekabet denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mutualizm",
        "Kommensalizm",
        "Türler arası rekabet",
        "Parazitlik"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-008",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Kalbin Çalışma Mekanizması",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kalbin sağ kulakçık duvarında bulunan ve kalp atışını başlatan doğal pil (uyarı merkezi) düğümü hangisidir?",
    "explanation": "Kalp kasılma uyarısı sağ kulakçıktaki Sinoatriyal (SA) düğümde başlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sinoatriyal (SA) düğüm",
        "Atriyoventriküler (AV) düğüm",
        "His demetleri",
        "Purkinje lifleri"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-009",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Kemosentez",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kemosentez yapan bir canlı için aşağıdakilerden hangisi kesinlikle doğrudur?",
    "explanation": "Kemosentez yalnızca bazı bakteri ve arkeler (prokaryotlar) tarafından gerçekleştirilir; ışık gerekmez.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Klorofil pigmenti taşır",
        "Prokaryot hücre yapısına sahiptir",
        "Sadece gündüz besin üretir",
        "Işık enerjisini kullanır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-BIY-M-010",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Sinir İmpulsu İletimi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir nöronun aksonunda miyelin kılıf bulunması impuls iletim hızını nasıl etkiler?",
    "explanation": "Miyelinli nöronlarda Ranvier boğumları arasında atlamalı iletim gerçekleştiği için impuls çok daha hızlı ilerler.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yavaşlatır",
        "Atlamalı iletim sağlayarak hızlandırır",
        "Değiştirmez",
        "İletimi durdurur"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-001",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Vektörler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aynı düzlemde aralarında 90° açı bulunan 6 N ve 8 N büyüklüğündeki iki kuvvetin bileşkesi kaç N olur?",
    "explanation": "R = √(6² + 8²) = √100 = 10 N bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10",
        "12",
        "14",
        "16"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-002",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "İtme ve Momentum",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kütlesi 3 kg olan bir cisim 8 m/s hızla hareket etmektedir. Cismin çizgisel momentumu kaç kg·m/s'dir?",
    "explanation": "P = m · v = 3 · 8 = 24 kg·m/s bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "16",
        "24",
        "32",
        "48"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-003",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Tork ve Denge",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Dönme noktasına dik uzaklığı 0.5 m olan noktaya uygulanan 40 N kuvvetin oluşturduğu tork kaç N·m'dir?",
    "explanation": "τ = F · d = 40 · 0.5 = 20 N·m olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10",
        "20",
        "30",
        "40"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-004",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Çembersel Hareket",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Periyodu 0.2 saniye olan düzgün çembersel hareket yapan bir cismin frekansı kaç s⁻¹'dir?",
    "explanation": "f = 1 / T = 1 / 0.2 = 5 s⁻¹ bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "5",
        "10"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-005",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Yay Enerjisi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yay sabiti k = 200 N/m olan bir yay 0.2 m sıkıştırıldığında yayda depolanan esneklik potansiyel enerjisi kaç Joule olur?",
    "explanation": "Ep = (1/2) · k · x² = 0.5 · 200 · (0.04) = 4 Joule olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "6",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-006",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Transformatörler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Giriş sarım sayısı 100, çıkış sarım sayısı 400 olan ideal bir transformatörün girişine 50 V alternatif gerilim uygulanırsa çıkış gerilimi kaç V olur?",
    "explanation": "V₂ / V₁ = N₂ / N₁ ⇒ V₂ = 50 · (400 / 100) = 200 V olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "100",
        "150",
        "200",
        "250"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-007",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Basit Makineler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kuvvet kazancı 4 olan sürtünmesiz bir makara sisteminde 120 N ağırlığındaki yükü dengelemek için kaç N kuvvet gerekir?",
    "explanation": "Kuvvet kazancı = Yük / Kuvvet ⇒ 4 = 120 / F ⇒ F = 30 N bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "20",
        "30",
        "40",
        "60"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-008",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Elektriksel Kuvvet (Coulomb)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İki noktasal yük arasındaki uzaklık yarıya indirilirse birbirlerine uyguladıkları elektriksel kuvvet kaç katına çıkar?",
    "explanation": "F = k·q₁·q₂ / d² bağıntısına göre d yarıya inerse kuvvet 4 katına çıkar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "8",
        "16"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-009",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Elektromanyetik Dalgalar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdakilerden hangisi bir elektromanyetik dalga değildir?",
    "explanation": "Ses dalgaları mekanik dalgadır; yayılması için maddesel ortam gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Radyo dalgaları",
        "X-ışınları",
        "Ses dalgaları",
        "Gama ışınları"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-E-010",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Atom Fiziği",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Temel haldeki bir atomun uyarılması sonucunda üst enerji düzeyine çıkan elektronun tekrar temel hale dönerken dışarıya yaydığı ışıma nedir?",
    "explanation": "Uyarılmış elektron alt enerji seviyesine inerken enerji farkına eşit enerjili bir foton yayınlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Alfa parçacığı",
        "Foton",
        "Nötron",
        "Proton"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-001",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Açısal Momentum",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Eylemsizlik momenti I = 4 kg·m² olan bir disk ω = 5 rad/s açısal hızla dönerken açısal momentumu kaç kg·m²/s olur?",
    "explanation": "L = I · ω = 4 · 5 = 20 kg·m²/s bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "15",
        "20",
        "25",
        "40"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-002",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Manyetik Kuvvet",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Büyüklüğü B = 4 T olan düzgün manyetik alana dik olarak yerleştirilen 0.5 m uzunluğundaki telden 3 A akım geçtiğinde tele etki eden manyetik kuvvet kaç N olur?",
    "explanation": "F = B · I · L = 4 · 3 · 0.5 = 6 N bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "6",
        "9",
        "12"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-003",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "İndüksiyon EMK",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir çerçeveden geçen manyetik akı 0.2 saniye içinde 0.8 Weber değiştiğine göre oluşan ortalama indüksiyon elektromotor kuvveti kaç Volt olur?",
    "explanation": "ε = -ΔΦ / Δt ⇒ |ε| = 0.8 / 0.2 = 4 Volt bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "6",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-004",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Kepler ve Kütle Çekim",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Yeryüzünde ağırlığı 360 N olan bir cismin, Dünya merkezinden 3R uzaklıktaki (R: Dünya yarıçapı) ağırlığı kaç N olur?",
    "explanation": "Çekim ivmesi uzaklığın karesiyle ters orantılıdır: 360 / 3² = 360 / 9 = 40 N olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "40",
        "60",
        "90"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-005",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "De Broglie Dalga Boyu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Çizgisel momentumu p olan bir parçacığın hızı iki katına çıkarılırsa De Broglie dalga boyu nasıl değişir?",
    "explanation": "λ = h / (m·v) bağıntısına göre hız 2 katına çıkarsa dalga boyu yarıya iner.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İki katına çıkar",
        "Yarıya iner",
        "Dört katına çıkar",
        "Değişmez"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-006",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Eğik Düzlem Dinamiği",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Eğik açısı 37° olan sürtünmesiz eğik düzlem üzerindeki 5 kg kütleli cismin ivmesi kaç m/s² olur? (sin 37° = 0.6, g = 10 m/s²)",
    "explanation": "a = g · sin(37°) = 10 · 0.6 = 6 m/s² bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "5",
        "6",
        "8"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-007",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Compton Saçılması",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Compton olayında durgun elektrona çarparak saçılan fotonun enerjisi ve dalga boyu gelen fotona göre nasıl değişir?",
    "explanation": "Foton enerjisinin bir kısmını elektrona aktardığı için enerjisi ve frekansı azalır, dalga boyu artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Enerjisi azalır, dalga boyu artar",
        "Enerjisi artar, dalga boyu azalır",
        "İkisi de azalır",
        "İkisi de değişmez"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-008",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Atwood Düzeneği (Makara Dinamiği)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Sürtünmesiz makaraya bağlı 3 kg ve 2 kg kütleli iki cisim serbest bırakıldığında sistemin ivmesi kaç m/s² olur? (g = 10 m/s²)",
    "explanation": "Fnet = (3 - 2)·10 = 10 N. Toplam kütle = 3 + 2 = 5 kg ⇒ a = 10 / 5 = 2 m/s² olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-009",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Alternatif Akım ve Rezonans",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir RLC alternatif akım devresinde indüktif reaktans (X_L) ile kapasitif reaktans (X_C) birbirine eşit olduğunda devre hangi durumdadır ve empedans (Z) neye eşittir?",
    "explanation": "X_L = X_C olduğunda devre rezonanstadır ve empedans minimum olup Z = R değerine eşittir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Rezonans durumu, Z = R",
        "Kısa devre durumu, Z = 0",
        "Yüksek empedans, Z = X_L + X_C",
        "Akım sıfır olur"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-H-010",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Çift Yarıkta Girişim (Young Deney)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Young çift yarık deneyinde kullanılan ışığın dalga boyu artırılırsa ekrandaki saçak genişliği (Δx) nasıl değişir?",
    "explanation": "Δx = (L · λ) / (d · n) bağıntısına göre dalga boyu λ artarsa saçak genişliği Δx artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Artar",
        "Azalır",
        "Değişmez",
        "Önce azalır sonra sıfırlanır"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-001",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Eğik Atış",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Hava direncinin önemsiz olduğu ortamda düşey yukarı 30 m/s hızla atılan bir cismin çıkabileceği maksimum yükseklik kaç metredir? (g = 10 m/s²)",
    "explanation": "h_max = v₀² / (2g) = 900 / 20 = 45 metre bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "45",
        "60",
        "90"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-002",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Esnek Olmayan Çarpışma",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Sürtünmesiz yatay düzlemde 10 m/s hızla giden 2 kg kütleli cisim durmakta olan 3 kg kütleli cisme çarparak kenetleniyor. Ortak kütlenin hızı kaç m/s olur?",
    "explanation": "Momentum korunumu: m₁·v₁ = (m₁ + m₂)·v_ort ⇒ 2·10 = 5·v_ort ⇒ v_ort = 4 m/s olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "5",
        "6"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-003",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Merkezcil Kuvvet",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yarıçapı 2 m olan yatay sürtünmesiz yörüngede 6 m/s çizgisel hızla dolanan 3 kg kütleli cisme etki eden merkezcil kuvvet kaç N olur?",
    "explanation": "Fm = m · v² / r = 3 · 36 / 2 = 54 N bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "27",
        "36",
        "54",
        "72"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-004",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Basit Harmonik Hareket",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yay sabiti k = 100 N/m olan yayın ucuna 4 kg kütleli cisim bağlanarak basit harmonik hareket yaptırılıyor. Hareketin periyodu kaç saniyedir? (π = 3)",
    "explanation": "T = 2π·√(m / k) = 2 · 3 · √(4 / 100) = 6 · (2 / 10) = 1.2 saniye olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0.6",
        "1.2",
        "1.8",
        "2.4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-005",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Sığaçlar (Kondansatörler)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Sığası 4 F olan bir kondansatör 12 V gerilim altında yüklendiğinde depoladığı yük kaç Coulomb olur?",
    "explanation": "Q = C · V = 4 · 12 = 48 Coulomb bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "24",
        "36",
        "48",
        "60"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-006",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Fotoelektrik Olay",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Eşik enerjisi 2.2 eV olan bir metale 5.0 eV enerjili fotonlar düşürüldüğünde sökülen fotoelektronların maksimum kinetik enerjisi kaç eV olur?",
    "explanation": "E_k = E_foton - E_bağlanma = 5.0 - 2.2 = 2.8 eV bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1.8",
        "2.8",
        "3.2",
        "7.2"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-007",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Bağıl Hareket",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Doğu yönünde 20 m/s hızla giden K aracındaki gözlemci, Batı yönünde 15 m/s hızla giden L aracını hangi hızla gidiyormuş gibi görür?",
    "explanation": "v_bağıl = v_L - v_K = (-15) - (+20) = -35 m/s (Batı yönünde 35 m/s).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Batıya 5 m/s",
        "Doğuya 35 m/s",
        "Batıya 35 m/s",
        "Doğuya 5 m/s"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-008",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Yatay Atış",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yerden 80 m yükseklikteki bir kuleden yatay 15 m/s hızla atılan bir cisim yatayda kaç metre uzağa düşer? (g = 10 m/s²)",
    "explanation": "h = (1/2)gt² ⇒ 80 = 5t² ⇒ t = 4 s. Yatay menzil x = v₀ · t = 15 · 4 = 60 metre olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "45",
        "60",
        "75",
        "90"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-009",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Paralel Levhalar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aralarında 0.2 m uzaklık bulunan iki paralel levha arasına 40 V potansiyel fark uygulanırsa levhalar arasındaki düzgün elektrik alan kaç V/m olur?",
    "explanation": "E = V / d = 40 / 0.2 = 200 V/m bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "80",
        "100",
        "200",
        "400"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-FIZ-M-010",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Radyoaktivite",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir radyoaktif çekirdek alfa (α) bozunması geçirdiğinde kütle numarası ve atom numarası nasıl değişir?",
    "explanation": "Alfa parçacığı (⁴₂He) yayınlandığında kütle numarası 4, atom numarası 2 azalır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kütle 4 azalır, atom 2 azalır",
        "Kütle 2 azalır, atom 4 azalır",
        "Kütle değişmez, atom 1 artar",
        "Kütle 4 artar, atom 2 artar"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-001",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Modern Atom Teorisi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Baş kuantum sayısı n = 3 olan enerji düzeyinde bulunan p alt kabuğunda en fazla kaç elektron bulunabilir?",
    "explanation": "p alt kabuğu 3 orbital içerir ve en fazla 3 · 2 = 6 elektron alabilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "6",
        "10",
        "14"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-002",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Gazlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Sabit sıcaklıkta ideal bir gazın hacmi yarıya indirilirse basıncı nasıl değişir?",
    "explanation": "Boyle Yasasına göre (P₁·V₁ = P₂·V₂) hacim yarıya inerse basınç 2 katına çıkar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yarıya iner",
        "İki katına çıkar",
        "Dört katına çıkar",
        "Değişmez"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-003",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Kimyasal Tepkimelerde Enerji",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Isı alarak gerçekleşen (endotermik) tepkimeler için entalpi değişimi ΔH'nin işareti nedir?",
    "explanation": "Endotermik tepkimelerde ortamdan ısı alındığı için ΔH > 0 (pozitif) olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "ΔH > 0",
        "ΔH < 0",
        "ΔH = 0",
        "Belirlenemez"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-004",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Tepkime Hızı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir kimyasal tepkimeye pozitif katalizör eklendiğinde aşağıdakilerden hangisi azalır?",
    "explanation": "Katalizör tepkimeye daha düşük enerjili bir mekanizma sağlayarak aktifleşme (eşik) enerjisini düşürür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tepkime entalpisi",
        "Aktifleşme enerjisi",
        "Ürün miktarı",
        "Denge sabiti"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-005",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Organik Kimyaya Giriş",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Doymuş hidrokarbonlar (alkanlar) sınıfının genel formülü aşağıdakilerden hangisidir?",
    "explanation": "Açık zincirli alkanların genel formülü CₙH₂ₙ₊₂ şeklindedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "CₙH₂ₙ₋₂",
        "CₙH₂ₙ",
        "CₙH₂ₙ₊₂",
        "CₙHₙ"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-006",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Elektrokimya",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Galvanik bir hücrede yükseltgenme yarı tepkimesi hangi elektrotta gerçekleşir?",
    "explanation": "Elektrokimyasal hücrelerde her zaman anotta yükseltgenme, katotta indirgenme gerçekleşir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Katot",
        "Anot",
        "Tuz köprüsü",
        "Dış devre"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-007",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Kuantum Sayıları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Açısal momentum (ikincil) kuantum sayısı l = 0 olan orbital türü aşağıdakilerden hangisidir?",
    "explanation": "l = 0 → s, l = 1 → p, l = 2 → d, l = 3 → f orbitalini temsil eder.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "s orbitali",
        "p orbitali",
        "d orbitali",
        "f orbitali"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-008",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Sıvı Çözeltiler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "1 kilogram çözücüde çözünmüş maddenin mol sayısını ifade eden derişim birimi hangisidir?",
    "explanation": "Molalite (m) = Çözünen mol sayısı / Çözücü kütlesi (kg) olarak tanımlanır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Molarite",
        "Molalite",
        "Kütlece yüzde",
        "Normalite"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-009",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Karbon Allotropları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Karbon atomlarının altıgen halkalar halinde tabakalar oluşturduğu ve elektriği ileten doğal allotropu hangisidir?",
    "explanation": "Grafit, yapısındaki pi (π) elektronları sayesinde elektriği ileten doğal karbon allotropudur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Elmas",
        "Grafit",
        "Fulleren",
        "Kuvars"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-E-010",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Le Chatelier İlkesi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Dengedeki bir kimyasal sisteme dışarıdan bir etki yapıldığında sistem bu etkiyi azaltacak yönde hareket eder. Bu ilke kime aittir?",
    "explanation": "Kimyasal dengede dış etkilere karşı sistemin tepkisini açıklayan ilke Le Chatelier İlkesidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Avogadro İlkesi",
        "Le Chatelier İlkesi",
        "Hund Kuralı",
        "Pauli İlkesi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-001",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Çözünürlük Dengesi (Kçç)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Belirli bir sıcaklıkta AgCl katısının saf sudaki çözünürlüğü 10⁻⁵ M olduğuna göre çözünürlük çarpımı Kçç kaçtır?",
    "explanation": "Kçç = [Ag⁺][Cl⁻] = (10⁻⁵) · (10⁻⁵) = 10⁻¹⁰ olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10⁻⁵",
        "2 × 10⁻⁵",
        "10⁻¹⁰",
        "4 × 10⁻¹⁰"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-002",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Faraday Elektroliz Yasası",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Erimiş AlCl₃ tuzu 3 Faraday elektrik yükü ile elektroliz edildiğinde katotta kaç mol Al metali toplanır? (Al³⁺)",
    "explanation": "Al³⁺ + 3e⁻ → Al(k) yarı tepkimesine göre 3 mol elektron (3 Faraday) 1 mol Al metali toplar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0.5",
        "1",
        "2",
        "3"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-003",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Nernst Denklemi ve Pil Potansiyeli",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Zn(k) + Cu²⁺(1 M) → Zn²⁺(1 M) + Cu(k) pilinde E°pil = 1.10 V olduğuna göre Cu²⁺ derişimi artırılırsa pil potansiyeli nasıl değişir?",
    "explanation": "Girenlerdeki Cu²⁺ derişimi artırılırsa denge ürünlere kayar ve pil potansiyeli 1.10 V değerinin üzerine çıkar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1.10 V'tan büyük olur",
        "1.10 V'tan küçük olur",
        "Değişmez",
        "Sıfır olur"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-004",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Hess Yasası",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "C(k) + O₂(g) → CO₂(g) tepkimesinin entalpisi ΔH = -390 kJ ise 2CO₂(g) → 2C(k) + 2O₂(g) tepkimesinin ΔH değeri kaç kJ olur?",
    "explanation": "Tepkime ters çevrilip 2 ile çarpıldığı için ΔH = -2 · (-390) = +780 kJ olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "-780",
        "-390",
        "+390",
        "+780"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-005",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Hız Denklemi Bulma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Hız bağıntısı r = k · [A]² · [B] olan bir tepkimede kabın hacmi sabit sıcaklıkta yarıya indirilirse tepkime hızı kaç katına çıkar?",
    "explanation": "Hacim yarıya inerse tüm derişimler 2 katına çıkar: r_yeni = k · (2[A])² · (2[B]) = 8 · r olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "6",
        "8"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-006",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Organik Fonksiyonel Gruplar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir karboksilik asit ile bir alkolün su açığa çıkararak birleşmesi tepkimesinden oluşan organik bileşik sınıfı hangisidir?",
    "explanation": "Karboksilik asit + Alkol → Ester + H₂O (esterleşme tepkimesi).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Eter",
        "Ester",
        "Aldehit",
        "Keton"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-007",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Zayıf Asit Dengesi (Ka)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "25 °C sıcaklıkta asitlik sabiti Ka = 10⁻⁵ olan 0.1 M monoprotik HA zayıf asit çözeltisinin pH değeri kaçtır?",
    "explanation": "[H⁺] = √(Ka · Cₐ) = √(10⁻⁵ · 10⁻¹) = 10⁻³ M ⇒ pH = 3 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "5"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-008",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Ortak İyon Etkisi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Doygun AgCl sulu çözeltisine sabit sıcaklıkta bir miktar NaCl katısı eklenip çözülürse AgCl tuzunun çözünürlüğü ve Kçç değeri nasıl değişir?",
    "explanation": "Ortak iyon (Cl⁻) çözünürlüğü azaltır; Kçç yalnızca sıcaklığa bağlı olduğundan değişmez.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Çözünürlük azalır, Kçç değişmez",
        "Çözünürlük artar, Kçç artar",
        "İkisi de azalır",
        "İkisi de değişmez"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-009",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "İzomerlik",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Kapalı formülleri aynı, fonksiyonel grupları farklı olan dimetil eter (CH₃-O-CH₃) ile etil alkol (C₂H₅OH) arasındaki izomerlik türü hangisidir?",
    "explanation": "Aynı karbon sayılı monoalkoller ile eterler birbirinin fonksiyonel grup izomeridir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Zincir-dallanma izomerliği",
        "Konum izomerliği",
        "Fonksiyonel grup izomerliği",
        "Geometrik (cis-trans) izomerlik"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-H-010",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Tepkime Mekanizması ve Molekülerite",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Çok basamaklı (mekanizmalı) bir kimyasal tepkimenin genel hız bağıntısını hangi basamak belirler?",
    "explanation": "Mekanizmalı tepkimelerde hız belirleyici basamak her zaman aktifleşme enerjisi en yüksek olan en yavaş basamaktır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "En hızlı basamak",
        "En yavaş basamak",
        "Son basamak",
        "Entalpisi en küçük basamak"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-001",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Molarite",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "0.4 mol NaOH katısı suda çözülerek toplam hacim 200 mL'ye tamamlanıyor. Çözeltinin molar derişimi kaç M olur?",
    "explanation": "M = n / V = 0.4 mol / 0.2 L = 2.0 M bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0.5",
        "1.0",
        "2.0",
        "4.0"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-002",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "İdeal Gaz Denklemi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "0 °C sıcaklıkta 5.6 L sabit hacimli kapta bulunan 0.5 mol ideal gazın basıncı kaç atm olur?",
    "explanation": "P · V = n · R · T ⇒ P · 5.6 = 0.5 · (22.4 / 273) · 273 ⇒ 5.6P = 11.2 ⇒ P = 2 atm olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-003",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Kimyasal Denge",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İleri yöndeki hız sabiti kᵢ = 0.6 ve geri yöndeki hız sabiti k₉ = 0.15 olan tek basamaklı denge tepkimesinin denge sabiti Kc kaçtır?",
    "explanation": "Kc = kᵢ / k₉ = 0.6 / 0.15 = 4 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-004",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Sulu Çözeltilerde pH",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "25 °C'de 0.01 M HCl kuvvetli asit çözeltisinin pH değeri kaçtır?",
    "explanation": "[H⁺] = 10⁻² M ⇒ pH = -log(10⁻²) = 2 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "12",
        "13"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-005",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Yükseltgenme Basamakları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "KMnO₄ bileşiğinde Mn (Mangan) elementinin yükseltgenme basamağı kaçtır? (K: +1, O: -2)",
    "explanation": "(+1) + Mn + 4(-2) = 0 ⇒ Mn - 7 = 0 ⇒ Mn = +7 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "+4",
        "+5",
        "+6",
        "+7"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-006",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Hibritleşme",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Metan (CH₄) molekülündeki merkez karbon atomunun hibritleşme türü nedir?",
    "explanation": "CH₄ molekülünde karbon atomu 4 tekli (sigma) bağ yaptığı için sp³ hibritleşmesi yapar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "sp",
        "sp²",
        "sp³",
        "dsp²"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-007",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Gazların Difüzyon Hızı (Graham)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aynı sıcaklıkta He (M = 4 g/mol) gazının yayılma hızı, SO₂ (M = 64 g/mol) gazının yayılma hızının kaç katıdır?",
    "explanation": "v(He) / v(SO₂) = √(64 / 4) = √16 = 4 katıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "8",
        "16"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-008",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Standart Oluşum Entalpisi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Standart koşullarda (25 °C, 1 atm) kararlı elementlerin standart molar oluşum entalpileri kaç kJ/mol kabul edilir?",
    "explanation": "O₂(g), Fe(k), H₂(g) gibi elementlerin en kararlı hallerinin standart oluşum entalpisi 0 kabul edilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "-100",
        "0",
        "+1",
        "+273"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-009",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Nötralleşme Titrasyonu",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "0.2 M 100 mL HCl çözeltisini tam nötralleştirmek için 0.1 M NaOH çözeltisinden kaç mL eklenmelidir?",
    "explanation": "Mₐ·Vₐ·zₐ = M_b·V_b·z_b ⇒ 0.2 · 100 · 1 = 0.1 · V_b · 1 ⇒ V_b = 200 mL gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "100",
        "150",
        "200",
        "400"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-KIM-M-010",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Alkenler ve Katılma Tepkimeleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yapısında en az bir tane karbon-karbon ikili bağı (C=C) bulunduran doymamış hidrokarbon sınıfı hangisidir?",
    "explanation": "C=C ikili bağı taşıyan hidrokarbonlara alken (olefin) denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Alkanlar",
        "Alkenler (Olefinler)",
        "Alkinler",
        "Sikloalkanlar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-001",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "İkinci Dereceden Denklemler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "x² - 7x + 12 = 0 denkleminin kökler toplamı kaçtır?",
    "explanation": "x₁ + x₂ = -b / a = -(-7) / 1 = 7 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "7",
        "12",
        "-7"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-002",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Logaritma",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "log₂(32) + log₃(27) işleminin sonucu kaçtır?",
    "explanation": "log₂(2⁵) + log₃(3³) = 5 + 3 = 8 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6",
        "7",
        "8",
        "9"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-003",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Diziler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Genel terimi aₙ = 3n + 2 olan bir dizinin ilk 4 teriminin toplamı kaçtır?",
    "explanation": "a₁ = 5, a₂ = 8, a₃ = 11, a₄ = 14 olup toplamları 5 + 8 + 11 + 14 = 38 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "34",
        "36",
        "38",
        "40"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-004",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Trigonometri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "sin²(35°) + cos²(35°) + tan(45°) işleminin sonucu kaçtır?",
    "explanation": "sin²(35°) + cos²(35°) = 1 ve tan(45°) = 1 olduğundan 1 + 1 = 2 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-005",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Limit",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "lim(x → 3) (x² - 2x + 5) limitinin değeri kaçtır?",
    "explanation": "Polinom fonksiyonlarda x = 3 yerine yazılırsa 3² - 2(3) + 5 = 9 - 6 + 5 = 8 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6",
        "8",
        "10",
        "12"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-006",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Türev Alma Kuralları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "f(x) = 4x³ - 5x + 7 fonksiyonunun x = 1 noktasındaki türevi f'(1) kaçtır?",
    "explanation": "f'(x) = 12x² - 5 ⇒ f'(1) = 12(1) - 5 = 7 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "7",
        "9",
        "12"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-007",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Karmaşık Sayılar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "i² = -1 olmak üzere √(-16) + √(-9) işleminin sonucu aşağıdakilerden hangisidir?",
    "explanation": "√(-16) = 4i ve √(-9) = 3i olduğundan toplamları 4i + 3i = 7i olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5i",
        "7i",
        "-7",
        "-25i"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-008",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Analitik Geometri - Eğim",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Analitik düzlemde A(1, 2) ve B(4, 11) noktalarından geçen doğrunun eğimi kaçtır?",
    "explanation": "m = (y₂ - y₁) / (x₂ - x₁) = (11 - 2) / (4 - 1) = 9 / 3 = 3 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-009",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Aritmetik Dizi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İlk terimi a₁ = 4 ve ortak farkı d = 5 olan bir aritmetik dizinin 7. terimi (a₇) kaçtır?",
    "explanation": "a₇ = a₁ + 6d = 4 + 6(5) = 34 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "29",
        "34",
        "39",
        "44"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-E-010",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Trigonometri - Esas Ölçü",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Ölçüsü 780° olan açının esas ölçüsü kaç derecedir?",
    "explanation": "780 = 2 · 360 + 60 olduğundan esas ölçüsü 60° olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "45",
        "60",
        "120"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-001",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Türev Uygulamaları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "f(x) = x³ - 6x² + 9x + 2 fonksiyonunun yerel maksimum noktasının ordinatı (y değeri) kaçtır?",
    "explanation": "f'(x) = 3x² - 12x + 9 = 3(x - 1)(x - 3) = 0. x = 1 yerel maksimum apsisidir: f(1) = 1 - 6 + 9 + 2 = 6 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "6",
        "8"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-002",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Belirli İntegral",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "∫₀² (3x² - 2x + 1) dx belirli integralinin değeri kaçtır?",
    "explanation": "[x³ - x² + x]₀² = (8 - 4 + 2) - 0 = 6 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "6",
        "8",
        "10"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-003",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "İntegralde Alan",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "y = x² parabolü ile y = 4 doğrusu arasında kalan kapalı bölgenin alanı kaç birimkaredir?",
    "explanation": "Kesim noktaları x = -2 ve x = 2. Alan = ∫₋₂² (4 - x²) dx = 2 · (8 - 8/3) = 32/3 birimkaredir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "16/3",
        "32/3",
        "12",
        "16"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-004",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Limit ve Süreklilik",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "lim(x → 2) (x³ - 8) / (x² - 4) limitinin değeri kaçtır?",
    "explanation": "(x - 2)(x² + 2x + 4) / [(x - 2)(x + 2)] sadeleşirse (4 + 4 + 4) / 4 = 12 / 4 = 3 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-005",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Maksimum Minimum Problemleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Toplamları 20 olan iki pozitif gerçel sayının çarpımının alabileceği en büyük değer kaçtır?",
    "explanation": "P(x) = x(20 - x) = 20x - x² fonksiyonu x = 10 için maksimum değerini alır: 10 · 10 = 100.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "64",
        "81",
        "96",
        "100"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-006",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Karmaşık Sayılar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "i² = -1 olmak üzere (1 + i)⁶ ifadesinin eşiti aşağıdakilerden hangisidir?",
    "explanation": "(1 + i)² = 2i olduğundan (1 + i)⁶ = (2i)³ = 8i³ = -8i bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "-8i",
        "8i",
        "-8",
        "8"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-007",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Binom Açılımı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "(2x - 1)⁵ ifadesinin açılımında x³ teriminin katsayısı kaçtır?",
    "explanation": "C(5,2) · (2x)³ · (-1)² = 10 · 8x³ · 1 = 80x³ olduğundan katsayısı 80 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "-80",
        "-40",
        "40",
        "80"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-008",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Logaritma Özellikleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "ln(e⁴) + log₅(1/25) - log(1000) işleminin sonucu kaçtır?",
    "explanation": "4 + (-2) - 3 = -1 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "-2",
        "-1",
        "0",
        "1"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-009",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Trigonometrik Denklemler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "[0, 2π) aralığında 2·cos(x) - 1 = 0 denkleminin kökler toplamı kaç radyandır?",
    "explanation": "cos(x) = 1/2 ⇒ x₁ = π/3 ve x₂ = 5π/3. Toplamları π/3 + 5π/3 = 2π olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "π",
        "3π/2",
        "2π",
        "5π/3"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-H-010",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Değişken Değiştirme ile İntegral",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "∫₀¹ 8x · (x² + 1)³ dx belirli integralinin değeri kaçtır?",
    "explanation": "u = x² + 1 ve du = 2x dx dönüşümüyle ∫₁² 4u³ du = [u⁴]₁² = 2⁴ - 1⁴ = 16 - 1 = 15 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12",
        "15",
        "16",
        "20"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-001",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Parabol",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "f(x) = x² - 6x + 13 parabolünün tepe noktasının ordinatı (k değeri) kaçtır?",
    "explanation": "r = -(-6) / 2 = 3. k = f(3) = 9 - 18 + 13 = 4 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-002",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Logaritma Denklemleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "log₃(x - 1) + log₃(x + 1) = 1 denklemini sağlayan pozitif x değeri kaçtır?",
    "explanation": "log₃(x² - 1) = 1 ⇒ x² - 1 = 3 ⇒ x² = 4 ⇒ x = 2 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "√2",
        "2",
        "√5",
        "3"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-003",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Geometrik Dizi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İlk terimi a₁ = 3 ve ortak çarpanı r = 2 olan pozitif terimli bir geometrik dizinin 5. terimi kaçtır?",
    "explanation": "a₅ = a₁ · r⁴ = 3 · 2⁴ = 3 · 16 = 48 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "24",
        "36",
        "48",
        "96"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-004",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Trigonometrik Özdeşlikler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "0 < x < π/2 olmak üzere sin(x) = 3/5 ise sin(2x) değeri kaçtır?",
    "explanation": "sin(x) = 3/5 ise cos(x) = 4/5 olur. sin(2x) = 2·sin(x)·cos(x) = 2 · (3/5) · (4/5) = 24/25 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12/25",
        "18/25",
        "24/25",
        "4/5"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-005",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Türev - Teğet Denklemi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "f(x) = x² + 3x - 1 eğrisine x = 2 apsisli noktasından çizilen teğetin eğimi kaçtır?",
    "explanation": "f'(x) = 2x + 3 ⇒ m = f'(2) = 2(2) + 3 = 7 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "6",
        "7",
        "9"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-006",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Belirsiz İntegral",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "f'(x) = 6x² - 4x + 3 ve f(1) = 7 olduğuna göre f(2) kaçtır?",
    "explanation": "f(x) = 2x³ - 2x² + 3x + c. f(1) = 3 + c = 7 ⇒ c = 4. f(2) = 16 - 8 + 6 + 4 = 18 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "14",
        "16",
        "18",
        "20"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-007",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "İkinci Dereceden Eşitsizlikler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "x² - 5x - 6 < 0 eşitsizliğini sağlayan kaç farklı x tam sayısı vardır?",
    "explanation": "(x - 6)(x + 1) < 0 ⇒ -1 < x < 6 aralığında 0, 1, 2, 3, 4, 5 olmak üzere 6 tam sayı vardır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "6",
        "7",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-008",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Çemberin Analitik İncelenmesi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Denklemi (x - 3)² + (y + 4)² = 25 olan çemberin merkezinin orijine olan uzaklığı kaç birimdir?",
    "explanation": "Merkez M(3, -4) noktasının orijine uzaklığı √(3² + (-4)²) = 5 birimdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "4",
        "5",
        "7"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-009",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Bileşke Fonksiyon Türevi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "f(x) = x² + 1 ve g(x) = 3x - 2 olduğuna göre (f ∘ g)'(1) değeri kaçtır?",
    "explanation": "(f ∘ g)'(1) = f'(g(1)) · g'(1). g(1) = 1, f'(x) = 2x ⇒ f'(1) = 2 ve g'(1) = 3 olduğundan 2 · 3 = 6 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "6",
        "9",
        "12"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-MAT-M-010",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Kosinüs Teoremi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir ABC üçgeninde |AB| = 5 cm, |AC| = 8 cm ve m(A) = 60° olduğuna göre |BC| kaç cm olur? (cos 60° = 1/2)",
    "explanation": "|BC|² = 5² + 8² - 2·5·8·cos(60°) = 25 + 64 - 40 = 49 ⇒ |BC| = 7 cm bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6",
        "7",
        "8",
        "9"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-001",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Söz Sanatları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Güneş her sabah bize gülümseyerek doğardı.\" dizelerinde kullanılan söz sanatı hangisidir?",
    "explanation": "İnsana özgü \"gülümseme\" özelliği güneşe verilerek teşhis (kişileştirme) yapılmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Teşbih (Benzetme)",
        "Teşhis (Kişileştirme)",
        "Mübalağa (Abartma)",
        "Tezat (Karşıtlık)"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-002",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Şiir Bilgisi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Dörtlük nazım birimiyle ve 11'li hece ölçüsüyle söylenen, aşk ve doğa temalı halk şiiri nazım biçimi hangisidir?",
    "explanation": "11'li hece ölçüsüyle söylenen âşık edebiyatının en yaygın nazım biçimi koşmadır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Koşma",
        "Semai",
        "Varsağı",
        "Destan"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-003",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "İslamiyet Öncesi Türk Edebiyatı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İslamiyet öncesi Türk edebiyatında ölen bir kişinin arkasından duyulan acıyı anlatmak için söylenen şiirlere ne ad verilir?",
    "explanation": "Yuğ törenlerinde ölen kişinin ardından söylenen ağıtlara İslamiyet öncesinde sagu denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Koşuk",
        "Sav",
        "Sagu",
        "Destan"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-004",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Divan Edebiyatı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Divan edebiyatında a-a, b-a, c-a... uyak düzeniyle yazılan, 5-15 beyitten oluşan ve aşk, şarap, güzellik konularını işleyen nazım biçimi hangisidir?",
    "explanation": "Aşk, kadın ve şarap temalı, 5-15 beyitlik nazım biçimi gazeldir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mesnevi",
        "Gazel",
        "Kaside",
        "Rubai"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-005",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Tanzimat Edebiyatı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Türk edebiyatında ilk yerli roman kabul edilen \"Taaşşuk-ı Talat ve Fitnat\" adlı eserin yazarı kimdir?",
    "explanation": "Şemsettin Sami tarafından 1872 yılında yazılan Taaşşuk-ı Talat ve Fitnat ilk yerli romanımızdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Namık Kemal",
        "Şemsettin Sami",
        "Ahmet Mithat Efendi",
        "Recaizade Mahmut Ekrem"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-006",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Millî Edebiyat",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Ömer Seyfettin, Ali Canip Yöntem ve Ziya Gökalp'in Selanik'te çıkardıkları ve \"Yeni Lisan\" makalesinin yayımlandığı dergi hangisidir?",
    "explanation": "1911 yılında Selanik'te çıkarılan Genç Kalemler dergisi Millî Edebiyat dönemini başlatmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Servet-i Fünun",
        "Genç Kalemler",
        "Dergâh",
        "Yedi Meşale"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-007",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Şiir Türleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yurt sevgisi, kahramanlık, yiğitlik ve savaş konularını coşkulu bir dille işleyen şiir türüne ne ad verilir?",
    "explanation": "Kahramanlık ve yiğitlik temalı şiirlere epik (destansı) şiir denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Lirik şiir",
        "Epik şiir",
        "Pastoral şiir",
        "Didaktik şiir"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-008",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Halk Hikâyeleri ve Destanlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Oğuz Türklerinin bilinen en eski epik-destansı hikâyelerini içeren ve 15. yüzyılda yazıya geçirilen başyapıt hangisidir?",
    "explanation": "Destan geleneğinden halk hikâyeciliğine geçişin en önemli eseri Dede Korkut Hikâyeleridir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Manas Destanı",
        "Dede Korkut Hikâyeleri",
        "Kutadgu Bilig",
        "Ergenekon Destanı"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-009",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Tasavvuf Halk Edebiyatı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "13. yüzyılda Anadolu'da yaşayan, \"Risaletü'n-Nushiye\" adlı mesnevisi ve duru Türkçesiyle yazdığı ilahileriyle tanınan büyük mutasavvıf şair kimdir?",
    "explanation": "Yunus Emre, ilahi nazım türünün ve Anadolu tasavvuf şiirinin en büyük temsilcisidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Pir Sultan Abdal",
        "Yunus Emre",
        "Kaygusuz Abdal",
        "Hacı Bayram Veli"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-E-010",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Tanzimat İlkeleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Türk edebiyatında ilk edebi roman kabul edilen \"İntibah\" ve ilk tarihi roman olan \"Cezmi\" adlı eserlerin yazarı kimdir?",
    "explanation": "Vatan şairi Namık Kemal, İntibah ve Cezmi romanlarının yazarıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ziya Paşa",
        "Namık Kemal",
        "Şinasi",
        "Sami Paşazade Sezai"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-001",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Divan Edebiyatı Şairleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "16. yüzyıl Divan şairi olan, \"Su Kasidesi\" ve \"Leyla vü Mecnun\" mesnevisiyle tanınan büyük şairimiz kimdir?",
    "explanation": "Fuzûlî, 16. yüzyılda Azeri Türkçesiyle yazdığı Su Kasidesi ve Leyla vü Mecnun mesnevisiyle ünlüdür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Bâkî",
        "Fuzûlî",
        "Nedîm",
        "Şeyh Gâlip"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-002",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Tanzimat Tiyatrosu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Şinasi tarafından yazılan ve Türk edebiyatında Batılı anlamda ilk tiyatro eseri kabul edilen töre komedisi hangisidir?",
    "explanation": "Şinasi'nin 1860 yılında yazdığı Şair Evlenmesi ilk yerli tiyatro eserimizdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Vatan yahut Silistre",
        "Şair Evlenmesi",
        "Çok Bilen Çok Yanılır",
        "Zavallı Çocuk"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-003",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Cumhuriyet Dönemi Romanı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Saatleri Ayarlama Enstitüsü\" ve \"Huzur\" romanlarında Doğu-Batı çatışmasını, zaman ve musiki kavramlarını işleyen yazarımız kimdir?",
    "explanation": "Ahmet Hamdi Tanpınar, Huzur ve Saatleri Ayarlama Enstitüsü romanlarının yazarıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Peyami Safa",
        "Ahmet Hamdi Tanpınar",
        "Yakup Kadri Karaosmanoğlu",
        "Oğuz Atay"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-004",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Modernist Roman",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Türk edebiyatında postmodernizmin öncüsü sayılan \"Tutunamayanlar\" ve \"Tehlikeli Oyunlar\" adlı eserlerin yazarı kimdir?",
    "explanation": "Oğuz Atay, Tutunamayanlar ve Tehlikeli Oyunlar ile modernist/postmodernist Türk romanının zirvesidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yaşar Kemal",
        "Orhan Kemal",
        "Oğuz Atay",
        "Kemal Tahir"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-005",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Fecriati Topluluğu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Sanat şahsi ve muhteremdir\" görüşünü savunan Fecriati topluluğunun en önemli şairi olup \"Merdiven\" ve \"O Belde\" şiirleriyle tanınan şairimiz kimdir?",
    "explanation": "Saf (öz) şiir ve sembolizm anlayışının temsilcisi Ahmet Haşim, Piyale ve Göl Saatleri kitaplarının şairidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ahmet Haşim",
        "Yahya Kemal Beyatlı",
        "Faruk Nafiz Çamlıbel",
        "Necip Fazıl Kısakürek"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-006",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "İkinci Yeni Şiiri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Üvercinka\" ve \"Göçebe\" adlı şiir kitaplarıyla İkinci Yeni hareketinin öncü isimlerinden olan şairimiz kimdir?",
    "explanation": "Cemal Süreya; Üvercinka, Göçebe ve Sevda Sözleri eserleriyle İkinci Yeni şiirinin usta şairidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Cemal Süreya",
        "Attilâ İlhan",
        "Cahit Sıtkı Tarancı",
        "Ahmet Muhip Dıranas"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-007",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Toplumcu Gerçekçi Roman",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"İnce Memed\", \"Yer Demir Gök Bakır\" ve \"Yılanı Öldürseler\" romanlarıyla Çukurova insanının yaşamını destansı bir dille anlatan yazarımız kimdir?",
    "explanation": "Yaşar Kemal, Çukurova yöresini ve İnce Memed serisini edebiyatımıza kazandıran büyük ustamızdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kemal Tahir",
        "Yaşar Kemal",
        "Fakir Baykurt",
        "Sabahattin Ali"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-008",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Divan Edebiyatı - Sebk-i Hindi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "18. yüzyılda Divan şiirinin son büyük ustası kabul edilen ve \"Hüsn ü Aşk\" adlı alegorik mesneviyi yazan şair kimdir?",
    "explanation": "Sebk-i Hindi akımının en önemli temsilcisi Şeyh Gâlip, Hüsn ü Aşk mesnevisinin yazarıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Nâbî",
        "Şeyh Gâlip",
        "Nef'î",
        "Bâkî"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-009",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Bireyin İç Dünyasını Esas Alan Roman",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Dokuzuncu Hariciye Koğuşu\", \"Fatih-Harbiye\" ve \"Yalnızız\" romanlarında psikolojik tahlillere geniş yer veren yazarımız kimdir?",
    "explanation": "Psikolojik roman türünün usta kalemi Peyami Safa, Dokuzuncu Hariciye Koğuşu ve Fatih-Harbiye'nin yazarıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Peyami Safa",
        "Tarık Buğra",
        "Memduh Şevket Esendal",
        "Sait Faik Abasıyanık"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-H-010",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Öz (Saf) Şiir Anlayışı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Kaldırımlar\", \"Çile\" ve \"Sakarya Türküsü\" şiirleriyle Cumhuriyet dönemi saf şiir ve mistik şiir anlayışının önde gelen şairi kimdir?",
    "explanation": "Kaldırımlar Şairi olarak da anılan Necip Fazıl Kısakürek, Çile adlı kitabında tüm şiirlerini toplamıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Cahit Sıtkı Tarancı",
        "Necip Fazıl Kısakürek",
        "Ahmet Muhip Dıranas",
        "Ziya Osman Saba"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-001",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Geçiş Dönemi Eserleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yusuf Has Hacib tarafından 11. yüzyılda kaleme alınan ve Türk edebiyatının ilk siyasetnamesi ile ilk mesnevisi kabul edilen eser hangisidir?",
    "explanation": "Kutadgu Bilig (Mutluluk Veren Bilgi), Karahanlı döneminde Yusuf Has Hacib tarafından yazılmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Divanü Lügati't-Türk",
        "Kutadgu Bilig",
        "Atabetü'l-Hakayık",
        "Divan-ı Hikmet"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-002",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Halk Edebiyatı Temsilcileri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Uzun ince bir yoldayım\" dizeleriyle tanınan, Cumhuriyet dönemi âşık tarzı halk şiirinin en önemli temsilcisi kimdir?",
    "explanation": "Âşık Veysel Şatıroğlu, \"Dostlar Beni Hatırlasın\" ve \"Uzun İnce Bir Yoldayım\" eserleriyle tanınır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Karacaoğlan",
        "Dadaloğlu",
        "Âşık Veysel Şatıroğlu",
        "Köroğlu"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-003",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Servet-i Fünun Romanı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Türk edebiyatında Batılı anlamda ilk modern roman sayılan \"Mai ve Siyah\" ile \"Aşk-ı Memnu\" eserlerinin yazarı kimdir?",
    "explanation": "Servet-i Fünun nesrinin usta ismi Halit Ziya Uşaklıgil, Mai ve Siyah ile Aşk-ı Memnu yazarımızdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mehmet Rauf",
        "Halit Ziya Uşaklıgil",
        "Tevfik Fikret",
        "Cenap Şahabettin"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-004",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Cumhuriyet Dönemi Şiiri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Orhan Veli Kanık, Melih Cevdet Anday ve Oktay Rifat'ın ölçü ve uyağı reddederek kurdukları şiir topluluğu hangisidir?",
    "explanation": "1941 yılında yayımladıkları Garip önsözüyle sıradan insanı ve serbest şiiri savunan topluluk Garip (I. Yeni) hareketidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Beş Hececiler",
        "Garip (I. Yeni)",
        "İkinci Yeni",
        "Hisarcılar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-005",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Edebi Akımlar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Gözlem ve belgeye büyük önem veren, \"roman, uzun bir yol boyunca gezdirilen aynadır\" anlayışını benimseyen edebi akım hangisidir?",
    "explanation": "Stendhal'ın \"yol boyunca gezdirilen ayna\" sözüyle özetlenen gerçekçilik akımı Realizmdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Romantizm",
        "Realizm",
        "Sembolizm",
        "Sürrealizm"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-006",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Geleneksel Türk Tiyatrosu",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kavuklu ve Pişekâr adlı başkahramanların yer aldığı, etrafı izleyicilerle çevrili bir alanda doğaçlama oynanan geleneksel tiyatro türü hangisidir?",
    "explanation": "Palanga adı verilen meydanda Kavuklu ve Pişekâr ekseninde oynanan oyun Orta Oyunudur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Karagöz",
        "Orta Oyunu",
        "Meddah",
        "Köy Seyirlik Oyunu"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-007",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Beş Hececiler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Han Duvarları\" ve \"Sanat\" şiirleriyle tanınan, Beş Hececiler topluluğunun en önemli şairi kimdir?",
    "explanation": "Memleket edebiyatının öncülerinden Faruk Nafiz Çamlıbel, Han Duvarları ve Çoban Çeşmesi şiirlerinin şairidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Faruk Nafiz Çamlıbel",
        "Enis Behiç Koryürek",
        "Orhan Seyfi Orhon",
        "Halit Fahri Ozansoy"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-008",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Millî Edebiyat Romanı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Çalıkuşu\", \"Yaprak Dökümü\" ve \"Acımak\" romanlarıyla Anadolu insanını yalın bir dille anlatan yazarımız kimdir?",
    "explanation": "Reşat Nuri Güntekin; Çalıkuşu, Yaprak Dökümü ve Yeşil Gece gibi eserlerin yazarıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yakup Kadri Karaosmanoğlu",
        "Reşat Nuri Güntekin",
        "Halide Edip Adıvar",
        "Refik Halit Karay"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-009",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Servet-i Fünun Şiiri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Sis\", \"Rübab-ı Şikeste\" ve çocuklar için yazdığı \"Şermin\" adlı eserleriyle tanınan Servet-i Fünun şairi kimdir?",
    "explanation": "Servet-i Fünun dergisinin yayın yönetmeni ve topluluğun en güçlü şairi Tevfik Fikret'tir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Cenap Şahabettin",
        "Tevfik Fikret",
        "Süleyman Nazif",
        "Hüseyin Cahit Yalçın"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "AYT-TUR-M-010",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Türkçenin İlk Sözlüğü",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kaşgarlı Mahmut tarafından Araplara Türkçeyi öğretmek amacıyla 11. yüzyılda yazılan ilk Türkçe sözlük ve dil bilgisi kitabı hangisidir?",
    "explanation": "Divanü Lügati't-Türk, Türk dilinin ilk ansiklopedik sözlüğüdür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Muhakemetü'l-Lügateyn",
        "Divanü Lügati't-Türk",
        "Kodeks Kumanikus",
        "Kutadgu Bilig"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-001",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA ve Genetik Kod",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "DNA molekülünün çift zincirli sarmal yapısında Adenin (A) bazının karşısına daima hangi baz gelir?",
    "explanation": "DNA'da Adenin ile Timin (A=T), Guanin ile Sitozin (G≡C) eşleşir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Guanin (G)",
        "Sitozin (C)",
        "Timin (T)",
        "Urasil (U)"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-002",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA Nükleotid Eşleşmesi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir nükleotidin yapısında aşağıdakilerden hangisi KESİNLİKLE bulunmaz?",
    "explanation": "Nükleotid = Fosfat + Deoksiriboz Şekeri + Azotlu Organik Baz formülünden oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Fosfat grubu",
        "Deoksiriboz şekeri",
        "Organik baz",
        "Ribozom organeli"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-003",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Fotosentez Temelleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yeşil bitkilerin fotosentez yapabilmesi için aşağıdakilerden hangisine ihtiyacı YOKTUR?",
    "explanation": "Bitkiler fotosentezde CO₂ ve su kullanarak besin ve oksijen üretir; oksijen tüketmezler.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Işık enerjisi",
        "Karbondioksit (CO₂)",
        "Su (H₂O)",
        "Oksijen gazı tüketimi"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-004",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Besin Zinciri Üreticileri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki canlılardan hangisi bir besin zincirinde \"üretici\" canlı basamağında yer alır?",
    "explanation": "Yeşil yapraklı buğday bitkisi klorofili sayesinde fotosentez yapan bir üreticidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Çekirge",
        "Buğday bitkisi",
        "Kurbağa",
        "Yılan"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-005",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Mendel Genetiği (Baskın Gen)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Canlılarda etkisini hem saf döl (homozigot) hem de melez (heterozigot) durumda gösteren genlere ne ad verilir?",
    "explanation": "Baskın genler büyük harfle gösterilir ve her durumda dış görünüşte etkisini gösterir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Baskın (Dominant) gen",
        "Çekinik (Resesif) gen",
        "Mutasyona uğramış gen",
        "Modifiye gen"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-006",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Adaptasyon Kavramı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kutup ayılarının beyaz kürk rengine ve kalın yağ tabakasına sahip olması hangi kavrama örnektir?",
    "explanation": "Canlının yaşadığı çevreye uyum sağlayarak yaşama ve üreme şansını artıran kalıtsal özellik adaptasyondur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Adaptasyon",
        "Modifikasyon",
        "Mutasyon",
        "Yapay seçilim"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-007",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Besin Zincirinde Ayrıştırıcılar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Besin zincirinde ölü canlı atıklarını parçalayarak inorganik maddelere dönüştüren canlılar kimlerdir?",
    "explanation": "Ayrıştırıcılar besin zincirinin her basamağında görev alır ve madde döngüsünü tamamlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ayrıştırıcılar (Mantar ve bakteriler)",
        "Birincil tüketiciler",
        "Otçullar",
        "Yalnızca etçil memeliler"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-008",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Kromozom Sayısı ve Gelişmişlik",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Farklı canlı türlerinin kromozom sayıları ile gelişmişlik düzeyleri arasında nasıl bir ilişki vardır?",
    "explanation": "Örn: Eğrelti otunun 500, insanın 46 kromozomu vardır; kromozom sayısı gelişmişlik ölçütü değildir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kromozom sayısı fazla olan canlı daha gelişmiştir",
        "Kromozom sayısı ile canlının gelişmişliği arasında doğrudan bir ilişki yoktur",
        "Kromozom sayısı az olan daha gelişmiştir",
        "Tüm canlıların kromozom sayısı aynıdır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-009",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Solunum Çeşitleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Hücrelerin besin maddelerini oksijen kullanarak parçalayıp enerji (ATP) üretmesine ne ad verilir?",
    "explanation": "Besinlerin mitokondride O₂ yardımıyla parçalanması oksijenli solunumdur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Oksijenli solunum",
        "Oksijensiz solunum (Fermantasyon)",
        "Fotosentez",
        "Terleme"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-E-010",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Biyoteknoloji Örnekleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsülin hormonunun bakterilere ürettirilmesi hangi bilimsel alanın başarısıdır?",
    "explanation": "Gen aktarımı yöntemiyle bakterilere insan insülini ürettirmek biyoteknolojinin en temel örneğidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Biyoteknoloji ve Gen Mühendisliği",
        "Fiziksel coğrafya",
        "Astronomi",
        "Meteoroloji"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-001",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA Nükleotid Sayısı Hesaplama",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "1200 nükleotidden oluşan bir DNA molekülünde 200 adet Guanin nükleotidi olduğuna göre bu DNA'da kaç adet Timin nükleotidi bulunur?",
    "explanation": "G = C = 200. Toplam G + C = 400. Kalan A + T = 1200 - 400 = 800. A = T olduğundan T = 400 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "200",
        "400",
        "600",
        "800"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-002",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Çaprazlama ve Olasılık Problemi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Melez döl kahverengi gözlü (Bb) bir anne ile mavi gözlü (bb) bir babanın doğacak ilk çocuklarının mavi gözlü olma olasılığı nedir?",
    "explanation": "Bb × bb çaprazlamasında genotipler: Bb, Bb, bb, bb (%50 melez kahverengi, %50 saf mavi).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "%0",
        "%25",
        "%50",
        "%75"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-003",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Akraba Evliliği ve Genetik Hastalıklar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Akraba evliliklerinde kalıtsal hastalıkların görülme sıklığının yüksek olmasının temel bilimsel gerekçesi nedir?",
    "explanation": "Kalıtsal hastalıkların çoğu çekinik genlerle taşınır; ortak atadan gelen çekinik genler birleşir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Akrabaların genetik benzerliğinin fazla olması nedeniyle çekinik hastalık genlerinin yan yana gelme olasılığının artması",
        "Akrabaların aynı kan grubuna sahip olması",
        "Akrabalarda mutasyon hızının daha yüksek olması",
        "Akrabaların aynı çevrede yaşaması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-004",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Besin Piramidinde Biyolojik Birikim",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Ot → Çekirge → Kurbağa → Yılan → Kartal besin zincirinde dokularında tarım ilacı (DDT) ve ağır metal birikimi EN FAZLA olan canlı hangisidir?",
    "explanation": "Biyolojik birikim (zehir oranı) besin piramidinin en üst basamağındaki son tüketicide (kartal) en fazladır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ot",
        "Çekirge",
        "Kurbağa",
        "Kartal"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-005",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Klonlama Aşamaları (Dolly)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Klonlanan bir canlının genetik ikizi, klonlama sürecinde hangi canlının genetik kopyasıdır?",
    "explanation": "Genetik materyal (DNA) çekirdekte bulunur; çekirdeği aktarılan canlının birebir genetik kopyası oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Çekirdeği alınan vücut hücresinin sahibinin",
        "Yumurta hücresi bağışlayan dişinin",
        "Taşıyıcı annenin",
        "Yavrunun babasının"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-006",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Karbon Döngüsü ve Küresel Isınma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Atmosferdeki karbondioksit (CO₂) miktarını azaltan ve karbonu biyolojik yapıya katan YEGÂNE temel olay hangisidir?",
    "explanation": "Atmosferdeki serbest CO₂ gazını bağlayarak organik maddeye dönüştüren tek süreç fotosentezdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Fotosentez",
        "Oksijenli solunum",
        "Fosil yakıtların yakılması",
        "Ayrıştırma faaliyetleri"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-007",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Fermantasyon ve Gaz Çıkışı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Hamurun mayalanması (maya mantarlarının etil alkol fermantasyonu) sırasında hamurun kabarmasını sağlayan gaz hangisidir?",
    "explanation": "Etil alkol fermantasyonunda etil alkol ile birlikte CO₂ gazı açığa çıkar; kabarcıklar hamuru kabartır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "O₂ (Oksijen)",
        "CO₂ (Karbondioksit)",
        "N₂ (Azot)",
        "H₂ (Hidrojen)"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-008",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA Replikasyonunda İplik Dağılımı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Kendini bir kez eşleyen bir DNA molekülünden oluşan iki yeni DNA molekülünün iplikleri nasıldır?",
    "explanation": "DNA eşlenmesi yarı korunumlu (semikonservatif) gerçekleşir; ana zincir kalıp olarak kullanılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Her iki DNA'da da biri eski, biri yeni sentezlenmiş iplik bulunur (Yarı korunumlu eşlenme)",
        "Bir DNA tamamen eski, diğeri tamamen yenidir",
        "İki iplik de tamamen parçalanıp yeniden yapılır",
        "Yalnızca tek bir yeni iplik oluşur"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-009",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Modifikasyon Örneklerinin Özellikleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aşağıdakilerden hangisi modifikasyonların mutasyonlardan en temel farkıdır?",
    "explanation": "Modifikasyon fenotipte görülür, genin işleyişi değişir ve kesinlikle sonraki nesle aktarılmaz.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Döllere kalıtsal olarak aktarılmaması ve genin nükleotid yapısının değil sadece işleyişinin değişmesi",
        "Yalnızca hayvanlarda görülmesi",
        "Zararlı etkilerinin olmaması",
        "Radyasyon sonucu ortaya çıkması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-H-010",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Işık Şiddeti ve Fotosentez Denge Noktası",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir bitkinin birim zamanda fotosentezle ürettiği oksijen miktarı, solunumla tükettiği oksijen miktarına eşit olduğunda ne gerçekleşir?",
    "explanation": "Fotosentez hızı solunum hızına eşit olduğunda bitki dış ortamdan O₂ almaz ve dışarı O₂ vermez.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Dış ortamla net gaz alışverişi sıfır olur (Denge noktası)",
        "Bitki kurur",
        "Fotosentez tamamen durur",
        "Bitki anında ölür"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-001",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA Replikasyon Aşamaları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Hücre bölünmesi öncesinde DNA'nın kendini eşlemesi (replikasyon) sırasında gerçekleşen ilk olay nedir?",
    "explanation": "İlk aşamada enzimler yardımıyla hidrojen bağları kopar ve DNA fermuar gibi iki ipliğe ayrılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "DNA sarmalının bir fermuar gibi ikiye açılması",
        "Sitoplazmadaki serbest nükleotidlerin çekirdeğe girmesi",
        "Kromozomların kutuplara çekilmesi",
        "Hücre zarının boğumlanması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-002",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Kalıtım (Fenotip ve Genotip Oranları)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Saf döl yuvarlak tohumlu (YY) bezelye ile buruşuk tohumlu (yy) bezelyenin çaprazlanmasından oluşan F1 dölünün genotip oranı nedir?",
    "explanation": "YY × yy çaprazlamasında yavruların tamamı (%100) melez döl (Yy) olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "%100 Heterozigot (Yy)",
        "%50 YY, %50 yy",
        "%25 YY, %50 Yy, %25 yy",
        "%100 Homozigot çekinik"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-003",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Mutasyon Sebepleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdakilerden hangisi canlılarda DNA yapısında kalıcı mutasyona yol açabilen çevresel faktörlerden biridir?",
    "explanation": "Radyasyon, X ışınları ve kimyasal maddeler gen dizilimini bozarak mutasyon oluşturur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Radyasyon (X ışınları ve zararlı UV)",
        "Sağlıklı beslenme",
        "Egzersiz yapma",
        "Temiz hava soluma"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-004",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Doğal Seçilim Mekanizması",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Çevre şartlarına uyum sağlayan güçlü canlıların hayatta kalması, uyum sağlayamayan zayıfların ise elenip yok olması sürecine ne ad verilir?",
    "explanation": "Darwin'in tanımladığı çevreye en iyi uyum sağlayanın hayatta kalması ilkesi doğal seçilimdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Doğal seçilim",
        "Yapay döllenme",
        "Klonlama",
        "Modifikasyon"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-005",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Besin Piramidinde Enerji Akışı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Üreticiden son tüketiciye doğru çıkıldıkça biyokütle ve aktarılan enerji miktarı nasıl değişir?",
    "explanation": "Üst basamaklara çıktıkça toplam biyokütle ve basamaklar arası enerji miktarı azalır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Biyokütle azalır, aktarılan enerji azalır",
        "Biyokütle artar, aktarılan enerji artar",
        "Biyokütle azalır, aktarılan enerji artar",
        "İkisi de değişmez"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-006",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Fotosentez ve Solunum Karşılaştırması",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Fotosentez ile solunum arasındaki ilişki için aşağıdakilerden hangisi DOĞRUDUR?",
    "explanation": "Fotosentezde üretilen besin (glikoz) ve oksijen, solunumda tüketilen temel maddelerdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Fotosentezin ürünleri solunumun girenleridir",
        "İkisi de yalnızca geceleri gerçekleşir",
        "Fotosentezde ATP harcanmaz",
        "Solunum yalnızca bitkilerde gerçekleşir"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-007",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Azot Döngüsü ve Bakteriler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Havadaki serbest azotu (N₂) bağlayarak baklagillerin kökünde bitkinin kullanabileceği forma dönüştüren canlılar hangileridir?",
    "explanation": "Rhizobium cinsi azot bağlayıcı bakteriler baklagil köklerinde yaşayarak havadaki azotu bağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Azot bağlayıcı bakteriler",
        "Ayrıştırıcı böcekler",
        "Karasinekler",
        "Memeli hayvanlar"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-008",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Biyoteknolojinin Olumsuz Yönleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdakilerden hangisi kontrolsüz biyoteknolojik uygulamaların potansiyel zararlarından biridir?",
    "explanation": "GDO'lu tohumların yaygınlaşması doğal türleri tehdit edebilir ve alerjiye neden olabilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Biyoçeşitliliğin azalması ve alerjik reaksiyon riskleri",
        "Yeni aşıların geliştirilmesi",
        "Daha dayanıklı tarım ürünleri üretilmesi",
        "Hastalıkların erken teşhis edilmesi"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-009",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Oksijensiz Solunum (Fermantasyon)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yoğurt mayalanması ve kaslarda yorgunluk hissi oluşması hangi fermantasyon çeşidi sonucunda gerçekleşir?",
    "explanation": "Sütten yoğurt oluşumu ve çizgili kasların oksijensiz ortamda çalışması laktik asit fermantasyonudur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Laktik asit fermantasyonu",
        "Etil alkol fermantasyonu",
        "Oksijenli yanma",
        "Fotosentez"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-BIY-M-010",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Cinsiyet Kalıtımı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İnsanda doğacak bir bebeğin cinsiyetinin kız veya erkek olma olasılığı her doğum için yüzde kaçtır?",
    "explanation": "Babadan gelen spermin X veya Y taşıma ihtimali eşit olduğundan olasılık daima %50'dir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "%25",
        "%50",
        "%75",
        "%100"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-001",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Mevsimlerin Oluşumu",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Dünya'nın Güneş etrafında dolanması ve 23° 27'lik eksen eğikliği aşağıdakilerden hangisine doğrudan neden olur?",
    "explanation": "Dünya'nın eksen eğikliği ve Güneş etrafındaki dolanma hareketi mevsimlerin oluşmasını sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Gece ve gündüzün ardalanmasına",
        "Mevsimlerin oluşumuna",
        "Güneş patlamalarına",
        "Ay tutulmasına"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-002",
    "examType": "LGS",
    "subject": "fen",
    "topic": "DNA ve Genetik Kod",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "DNA'nın temel yapı birimi aşağıdakilerden hangisidir?",
    "explanation": "DNA'nın temel yapı birimi nükleotiddir. Görev birimi ise gendir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Gen",
        "Kromozom",
        "Nükleotid",
        "Organik baz"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-003",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Katı Basıncı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Katı cisimlerin zemine uyguladığı basıncı artırmak için aşağıdakilerden hangisi yapılmalıdır?",
    "explanation": "P = G/S formülüne göre temas yüzey alanı küçüldükçe katı basıncı artar (örn. bıçağın bilenmesi).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ağırlık sabitken temas yüzey alanını küçültmek",
        "Temas yüzeyini büyütmek",
        "Ağırlığı azaltmak",
        "Cismin hacmini artırıp kütlesini azaltmak"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-004",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Periyodik Sistem",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Periyodik tablonun aynı grubunda (aynı düşey sütununda) yukarıdan aşağıya doğru inildikçe genellikle ne artar?",
    "explanation": "Aynı grupta yukarıdan aşağı inildikçe katman sayısı (periyot numarası) her adımda 1 artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Katman (periyot) sayısı",
        "Değerlik elektron sayısı",
        "Ametallik özellik",
        "İyonlaşma enerjisi"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-005",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Fiziksel ve Kimyasal Değişimler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki olaylardan hangisi kimyasal bir değişime örnektir?",
    "explanation": "Demirin paslanması oksijenle tepkimeye girdiği için kimyasal değişimdir; maddenin kimliği değişir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yoğurttan ayran yapılması",
        "Kağıdın yırtılması",
        "Demirin paslanması",
        "Buzun erimesi"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-006",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Asitler ve Bazlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kırmızı turnusol kâğıdını maviye çeviren ve sulu çözeltisinde OH⁻ iyonu oluşturan maddeler hangisidir?",
    "explanation": "Bazlar kırmızı turnusolu maviye çevirir, tatları acıdır ve ele kayganlık hissi verir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Asitler",
        "Bazlar",
        "Tuzlar",
        "Nötr sıvılar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-007",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Basit Makineler (Makaralar)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Sürtünmesiz bir sabit makara ile ilgili aşağıdakilerden hangisi doğrudur?",
    "explanation": "Sabit makaralarda kuvvet kazancı yoktur; kuvvetin yönünü değiştirerek iş kolaylığı sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kuvvetten 2 kat kazanç sağlar",
        "Kuvvetin yönünü değiştirerek iş kolaylığı sağlar",
        "Yoldan kazanç sağlar",
        "İşten kazanç sağlar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-008",
    "examType": "LGS",
    "subject": "fen",
    "topic": "İklim ve Hava Olayları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Dar bir alanda, kısa süre içerisinde değişkenlik gösteren atmosfer olaylarına ne ad verilir?",
    "explanation": "Kısa süreli ve anlık atmosfer olaylarına hava durumu, uzun yıllar ortalamasına iklim denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İklim",
        "Hava durumu (olayları)",
        "Küresel ısınma",
        "Sera etkisi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-009",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Canlılar ve Enerji İlişkileri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir besin zincirinin ilk basamağında (üreticiler) daima hangi canlı grubu yer alır?",
    "explanation": "Besin zincirinin tabanında Güneş ışığını kullanarak besin üreten üreticiler (klorofilli canlılar/bitkiler) bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Otçul hayvanlar",
        "Etçil hayvanlar",
        "Kendi besinini üreten fotosentetik canlılar",
        "Ayrıştırıcı mantarlar"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-E-010",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Elektrik Yükleri ve Elektriklenme",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yün kumaşa sürtülen ebonit (plastik) çubuk hangi cins elektrik yüküyle yüklenir?",
    "explanation": "Ebonit çubuk yün kumaşa sürtüldüğünde yün kumaştan elektron alarak negatif (-) yükle yüklenir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Pozitif (+)",
        "Negatif (-)",
        "Nötr kalır",
        "Önce +, sonra -"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-001",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Bileşik Basınç ve U Borusu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Taban alanı 2S olan h yüksekliğindeki d yoğunluklu sıvı kabın tabanına P basıncı yapmaktadır. Sıvı taban alanı S olan düşey bir kaba aktarılırsa tabandaki sıvı basıncı kaç P olur?",
    "explanation": "V = 2S·h sabit kalır. Yeni yükseklik h' = 2S·h/S = 2h olur. Yeni basınç P' = 2h·d·g = 2P olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "P",
        "2P",
        "3P",
        "4P"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-002",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Eksen Eğikliği ve Güneş Açıları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "21 Haziran tarihinde Güneş ışınları Yengeç Dönencesi'ne (23° 27' K) dik açıyla (90°) geldiğinde, Kuzey Kutup Dairesi'nde (66° 33' K) gündüz süresi yaklaşık kaç saattir?",
    "explanation": "21 Haziran'da Kuzey Kutup Dairesi ve kuzeyinde 24 saat kesintisiz gündüz yaşanır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12 saat",
        "16 saat",
        "20 saat",
        "24 saat"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-003",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Palanga Mekaniği",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Ağırlıkları ve sürtünmeleri ihmal edilen bir palangada yük 3 hareketli ip tarafından taşınmaktadır. 180 N ağırlığındaki yükü dengeleyen kuvvet kaç N olur?",
    "explanation": "F = G / 3 = 180 / 3 = 60 N kuvvet gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30 N",
        "60 N",
        "90 N",
        "120 N"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-004",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Periyodik Özelliklerin Değişimi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Periyodik tabloda aynı periyotta soldan sağa doğru gidildikçe atom numarası ve metalik özellik nasıl değişir?",
    "explanation": "Soldan sağa proton sayısı (atom numarası) artar, elektron verme eğilimi azaldığı için metalik özellik azalır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Atom numarası artar, metalik özellik azalır",
        "Atom numarası azalır, metalik özellik artar",
        "İkisi de artar",
        "İkisi de azalır"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-005",
    "examType": "LGS",
    "subject": "fen",
    "topic": "DNA Replikasyonu ve Hata Onarımı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "DNA'nın tek bir zincirinde meydana gelen nükleotid eşleşme hataları veya boşlukları DNA ligaz ve polimeraz enzimleri ile onarılabilirken, hangi durumda DNA onarılamaz?",
    "explanation": "Karşılıklı her iki zincirdeki nükleotidlerin birlikte kaybolduğu çift taraflı hasarlar onarılamaz (mutasyon kalıcı olur).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Karşılıklı iki zincirde de aynı bölgedeki nükleotidlerin aynı anda kopması (çift zincir kırığı)",
        "Adenin karşısına sitozin gelmesi",
        "Timin karşısında boşluk kalması",
        "Guanin nükleotidinin hasar görmesi"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-006",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Asit Yağmurları ve Kimyasal Etkisi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Fosil yakıtların yanması sonucu atmosfere salınan SO₂ ve NO₂ gazlarının su buharıyla tepkimeye girmesi sonucu oluşan asit yağmurları en çok hangi tarihi yapılara zarar verir?",
    "explanation": "Asitler karbonatlı kayaçlarla (mermer ve kireç taşı: CaCO₃) tepkimeye girerek onları aşındırır ve CO₂ gazı çıkarır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Plastik heykellere",
        "Kalker ve mermer (CaCO₃) içeren tarihi eserlere",
        "Cam pencerelere",
        "Saf altın kaplamalara"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-007",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Bileşik Basit Makineler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Kuvvet kazancı 2 olan bir kaldıraç ile kuvvet kazancı 4 olan bir eğik düzlemin art arda bağlandığı bileşik bir makine sisteminde toplam kuvvet kazancı kaçtır?",
    "explanation": "Bileşik makinelerde toplam kuvvet kazancı bileşenlerin kuvvet kazançlarının çarpımına eşittir: 2 × 4 = 8.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6",
        "8",
        "12",
        "16"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-008",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Besin Piramidinde Enerji Aktarımı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Üreticiden son tüketiciye doğru gidildikçe basamaklar arasında aktarılan enerji oranı (yüzde 10 kuralı) ve biyolojik birikim (zehir) miktarı nasıl değişir?",
    "explanation": "Her basamakta enerjinin yalnızca yaklaşık %10'u üst basamağa aktarılır, dokularda biriken zehirli madde miktarı ise artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Enerji artar, zehir azalır",
        "Enerji her basamakta %90 kaybedilir, zehir miktarı artar",
        "İkisi de artar",
        "İkisi de sabit kalır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-009",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Gaz Basıncı ve Hacim İlişkisi (Boyle-Mariotte)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Hareketli sürtünmesiz pistonlu bir kapta bulunan gazın hacmi sıcaklık sabit tutularak yarıya (V/2) indirilirse gaz basıncı nasıl değişir?",
    "explanation": "P · V = sabit (sıcaklık sabit). Hacim yarıya inince birim hacme düşen tanecik sayısı ve çarpışma iki katına çıkar, basınç 2P olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yarıya iner",
        "2 katına çıkar",
        "Değişmez",
        "4 katına çıkar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-H-010",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Biyoteknoloji ve Genetik Mühendisliği",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Ateş böceğinin ışık saçmasını sağlayan lüsiferaz geninin tütün bitkisine aktarılması sonucu tütün bitkisinin ışık saçması hangi biyoteknolojik yöntemle gerçekleşmiştir?",
    "explanation": "Farklı bir canlı türünden istenen bir genin başka bir canlıya aktarılması gen aktarımıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Geleneksel ıslah",
        "Gen aktarımı (Transgenik organizma / GDO)",
        "Klonlama",
        "Aşılama"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-001",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Sıvı Basıncı ve Pascal Prensibi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Durgun sıvıların kap tabanına uyguladığı basınç formülü P = h · d · g olduğuna göre, sıvı basıncı hangi iki nicelikle doğru orantılıdır?",
    "explanation": "Sıvı basıncı derinlik ve sıvının yoğunluğu ile doğrudan doğru orantılıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kabın şekli ve sıvı hacmi",
        "Sıvı derinliği (h) ve sıvı yoğunluğu (d)",
        "Kabın taban alanı ve sıvı rengi",
        "Sıvının kütlesi ve atmosfer basıncı"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-002",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Kalıtım ve Çaprazlama",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Melez döl sarı tohumlu (Ss) iki bezelyenin çaprazlanması sonucu yeşil tohumlu (ss) bezelye oluşma olasılığı yüzde kaçtır?",
    "explanation": "Ss × Ss çaprazlamasında genotipler: SS, Ss, Ss, ss (1/4 yani %25 saf çekinik yeşil).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "%0",
        "%25",
        "%50",
        "%75"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-003",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Kimyasal Tepkimelerde Kütlenin Korunumu",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "A + B → C + D kapalı kapta gerçekleşen tepkimede 12 g A ile 28 g B tamamen birleştiğinde 16 g C oluşmuştur. Oluşan D maddesi kaç gramdır?",
    "explanation": "Kütlenin korunumuna göre: 12 + 28 = 16 + m(D) ⇒ 40 = 16 + m(D) ⇒ m(D) = 24 g.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "20 g",
        "24 g",
        "28 g",
        "32 g"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-004",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Basit Makineler (Eğik Düzlem)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Boyu L = 6 m, yüksekliği h = 2 m olan sürtünmesiz bir eğik düzlemde kuvvet kazancı kaçtır?",
    "explanation": "Eğik düzlemde kuvvet kazancı = L / h = 6 / 2 = 3'tür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-005",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Rüzgâr ve Basınç Alanları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Komşu iki bölgeden K bölgesinde alçaltıcı hava hareketi (yüksek basınç), L bölgesinde ise yükseltici hava hareketi (alçak basınç) görülmektedir. Rüzgârın yönü nasıldır?",
    "explanation": "Rüzgâr daima yüksek basınç (K) alanından alçak basınç (L) alanına doğru yatay yönde eser.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "L'den K'ye doğrudur",
        "K'den L'ye doğrudur",
        "Rüzgâr esmez",
        "Aşağıdan yukarıya doğrudur"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-006",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Mutasyon ve Modifikasyon",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Çuha çiçeğinin 15-25 °C'de kırmızı, 25-35 °C'de beyaz çiçek açması hangi biyolojik kavramla açıklanır?",
    "explanation": "Çevre etkisiyle genlerin işleyişinin değişmesi modifikasyondur; kalıtsal değildir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mutasyon",
        "Modifikasyon",
        "Adaptasyon",
        "Klonlama"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-007",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Asit-Baz Belirteçleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Fenolftalein damlatıldığında pembe renge dönen ve pH değeri 7'den büyük olan sulu çözelti aşağıdakilerden hangisi olabilir?",
    "explanation": "Fenolftalein bazik ortamlarda pembe renk verir; sabunlu su baziktir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Limon suyu (pH 2.5)",
        "Mide asidi (pH 1.5)",
        "Sabunlu su (pH 9)",
        "Saf su (pH 7)"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-008",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Kaldıraç Sistemleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kuvvet kolu 120 cm, yük kolu 40 cm olan bir kaldıraçta kuvvet kazancı kaçtır?",
    "explanation": "Kuvvet kazancı = Kuvvet Kolu / Yük Kolu = 120 / 40 = 3 kat kuvvet kazancı sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-009",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Fotosentez Hızını Etkileyen Faktörler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bitkilerde fotosentez hızının en yüksek olduğu ışık renkleri hangileridir?",
    "explanation": "Klorofil yeşil ışığı yansıttığı için yeşilde fotosentez en yavaş, kırmızı ve mor ışıkta ise en hızlıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yeşil ve sarı",
        "Kırmızı ve mor (mavi)",
        "Yalnızca beyaz",
        "Turuncu ve yeşil"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FEN-M-010",
    "examType": "LGS",
    "subject": "fen",
    "topic": "Madde ve Isı (Öz Isı)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Eşit kütleli su (c = 4.18 J/g°C) ve demir (c = 0.46 J/g°C) özdeş ısıtıcılarla eşit süre ısıtılırsa sıcaklık artışları nasıl olur?",
    "explanation": "Öz ısısı küçük olan maddeler (demir) az ısıyla çok daha çabuk ısınır ve sıcaklığı daha fazla artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Suyun sıcaklığı demirden daha çok artar",
        "Demirin sıcaklığı sudan çok daha hızlı artar",
        "İkisinin sıcaklık artışı eşit olur",
        "Suyun sıcaklığı hiç değişmez"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-001",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Mevsimlerin Oluşumu",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Dünya'nın Güneş etrafında dolanması ve eksen eğikliği sonucunda aşağıdakilerden hangisi meydana gelir?",
    "explanation": "Dünya'nın 23° 27'lik eksen eğikliği ve yıllık hareketi mevsimleri oluşturur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Gece ve gündüzün ardalanması",
        "Mevsimlerin oluşumu",
        "Güneş tutulması",
        "Ay evreleri"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-002",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "İklim ve Hava Hareketleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Geniş bir bölgede uzun yıllar boyunca gözlemlenen hava olaylarının ortalamasına ne ad verilir?",
    "explanation": "Uzun yıllar (35-40 yıl) boyunca değişmeyen ortalama hava koşulları iklimdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Hava durumu",
        "İklim",
        "Basınç",
        "Rüzgâr"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-003",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Katı Basıncı Temelleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Katı cisimlerin zemine uyguladığı basınç aşağıdakilerden hangisine bağlı DEĞİLDİR?",
    "explanation": "Katı basıncı P = F / S formülüyle bulunur; cismin rengine bağlı değildir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Cismin ağırlığına",
        "Temas yüzey alanına",
        "Cismin rengine",
        "Zemine uygulanan dik kuvvete"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-004",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Rüzgâr Oluşumu",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Rüzgâr, yatay yönde hangi basınç alanından hangi basınç alanına doğru eser?",
    "explanation": "Rüzgâr daima yüksek basınç (soğuk) alanından alçak basınç (sıcak) alanına doğru eser.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Alçak basınçtan yüksek basınca",
        "Yüksek basınçtan alçak basınca",
        "Soğuk havadan soğuk havaya",
        "Nemli alandan kuru alana"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-005",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Basit Makineler (Kaldıraç)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdakilerden hangisi desteğin ortada olduğu çift taraflı bir kaldıraç örneğidir?",
    "explanation": "Makas ve tahterevallide destek noktası yük ile kuvvetin ortasındadır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "El arabası",
        "Ceviz kıracağı",
        "Makas",
        "Cımbız"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-006",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Sıvı Basıncı Temelleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Durgun sıvıların kap tabanına uyguladığı basınç sıvının hangi özelliğine bağlıdır?",
    "explanation": "Sıvı basıncı P = h · d · g bağıntısıyla hesaplanır; derinlik ve yoğunluğa bağlıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yalnızca hacmine",
        "Yalnızca kabın şekline",
        "Derinliğine ve yoğunluğuna",
        "Kabın genişliğine"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-007",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Makaralar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Sabit makara kullanmanın sağladığı en temel kolaylık nedir?",
    "explanation": "Sabit makarada kuvvet kazancı yoktur, kuvvetin yönünü değiştirerek iş kolaylığı sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kuvvetten kazanç sağlar",
        "Yoldan kazanç sağlar",
        "Kuvvetin yönünü değiştirir",
        "İşten kazanç sağlar"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-008",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Gölge Boyu Değişimi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kuzey Yarım Küre'de öğle vaktinde cisimlerin gölge boyunun en kısa olduğu tarih hangisidir?",
    "explanation": "21 Haziran yaz gündönümünde Güneş ışınları Yengeç Dönencesi'ne en dik açıyla geldiğinden gölge en kısadır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "21 Mart",
        "21 Haziran",
        "23 Eylül",
        "21 Aralık"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-009",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Eğik Düzlem Temeli",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Sürtünmesiz bir eğik düzlemde yükü yukarı çıkarırken aşağıdakilerden hangisi kesinlikle sağlanır?",
    "explanation": "Hiçbir basit makinede işten kazanç olmaz; eğik düzlem yoldan kaybettirerek kuvvetten kazanç sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İşten kazanç",
        "Kuvvetten kazanç",
        "Yoldan kazanç",
        "Enerjiden kazanç"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-E-010",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Dişli Çarklar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Birbirine dıştan temas eden iki dişli çark döndürüldüğünde dönme yönleri nasıldır?",
    "explanation": "Birbirini dıştan çeviren dişliler daima birbirine zıt yönde döner.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Aynı yönde dönerler",
        "Zıt yönde dönerler",
        "İkisi de durur",
        "Dönme yönleri tahmin edilemez"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-001",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Bileşik Basınç Problemi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Taban alanı 2S olan h yüksekliğindeki d yoğunluklu sıvı tabana P basıncı yapmaktadır. Sıvının tamamı taban alanı S olan bir kaba dökülürse tabandaki sıvı basıncı kaç P olur?",
    "explanation": "Hacim V = 2S · h. Taban alanı S olunca yeni yükseklik 2h olur. Yeni basınç P' = 2h·d·g = 2P olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "P",
        "2P",
        "3P",
        "4P"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-002",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Palanga Sistemleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Toplam 3 makaradan oluşan bir palanga sisteminde ip yukarı doğru çekilmektedir. 120 N yükü dengeleyen kuvvet kaç N'dur?",
    "explanation": "İp yukarı çekiliyorsa yükü taşıyan ip sayısı n = 3 olur. F = G / 3 = 120 / 3 = 40 N bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "40",
        "60",
        "120"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-003",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Vida Adımı Mekaniği",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Vida adımı a = 2 mm olan bir vida tornavida ile 10 tam tur döndürüldüğünde tahta blok içinde kaç mm ilerler?",
    "explanation": "İlerleme miktarı h = n · a = 10 · 2 = 20 mm olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "10",
        "20",
        "40"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-004",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "U Borusu Basınç Dengesi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "U borusunda birbirine karışmayan d₁ ve d₂ yoğunluklu sıvılar dengededir. h₁ = 10 cm ve h₂ = 15 cm olduğuna göre d₁ / d₂ oranı kaçtır?",
    "explanation": "Taban hizasındaki basınçlar eşittir: h₁ · d₁ = h₂ · d₂ ⇒ 10 · d₁ = 15 · d₂ ⇒ d₁ / d₂ = 1.5 = 3/2 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2/3",
        "3/2",
        "4/9",
        "9/4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-005",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Bileşik Basit Makineler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Kuvvet kazancı 2 olan bir kaldıraç ile kuvvet kazancı 3 olan bir eğik düzlemin birleştirilmesiyle kurulan bileşik sistemde toplam kuvvet kazancı kaçtır?",
    "explanation": "Bileşik makinelerde toplam kuvvet kazancı bileşenlerin kuvvet kazançlarının çarpımıdır: 2 · 3 = 6 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "6",
        "8",
        "9"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-006",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Isı ve Sıcaklık Değişimi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Öz ısısı büyük olan maddeler, öz ısısı küçük olan maddelere göre eşit ısı aldıklarında sıcaklıkları nasıl değişir?",
    "explanation": "Q = m·c·ΔT bağıntısına göre öz ısısı (c) büyük olan maddeler geç ısınır ve geç soğur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Daha hızlı yükselir",
        "Daha yavaş yükselir",
        "Sıcaklığı hiç değişmez",
        "Sıcaklığı düşer"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-007",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Basınç ve Hal Değişimi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Düdüklü tencerede suyun 100 °C yerine yaklaşık 120 °C'de kaynamasının nedeni nedir?",
    "explanation": "Sıvı yüzeyindeki basınç arttıkça kaynama noktası yükselir; bu sayede yemekler daha yüksek sıcaklıkta pişer.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İçerideki gaz basıncının açık hava basıncından yüksek olması",
        "Isıtıcının gücünün yüksek olması",
        "Sıvı hacminin azalması",
        "Tencerenin metalden yapılmış olması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-008",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Atmosfer Basıncı Yükseklik İlişkisi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Deniz seviyesinden dağın zirvesine doğru çıkıldıkça açık hava basıncı ve suyun kaynama noktası nasıl değişir?",
    "explanation": "Yükseklere çıkıldıkça açık hava basıncı azalır, basınca bağlı olarak kaynama noktası da 100 °C'nin altına düşer.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Basınç artar, kaynama noktası artar",
        "Basınç azalır, kaynama noktası azalır",
        "Basınç azalır, kaynama noktası artar",
        "Basınç değişmez, kaynama noktası azalır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-009",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Dişli ve Kasnak Dönme Sayısı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Yarıçapı 3r olan K dişlisi 2 tur attığında, ona bağlı r yarıçaplı L dişlisi kaç tur atar?",
    "explanation": "n₁ · r₁ = n₂ · r₂ ⇒ 2 · 3r = n₂ · r ⇒ n₂ = 6 tur döner.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "6",
        "8",
        "9"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-H-010",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Eksen Eğikliği ve Gece-Gündüz",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "21 Aralık tarihinde Güney Kutup Dairesi'nde (66.5° G) yaşanan gündüz süresi yaklaşık kaç saattir?",
    "explanation": "21 Aralık'ta Güney Yarım Küre yazı yaşar ve Güney Kutup Dairesi'nde 24 saat kesintisiz gündüz yaşanır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0 saat",
        "12 saat",
        "18 saat",
        "24 saat"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-001",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Sıvı Basıncı ve Pascal Prensibi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kapalı bir kaptaki sıvıya uygulanan basıncın sıvının her noktasına aynen iletilmesine ne ad verilir?",
    "explanation": "Sıvıların sıkıştırılamaz olması nedeniyle basıncı her yöne aynen iletmesi Pascal prensibidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Arşimet Prensibi",
        "Pascal Prensibi",
        "Bernoulli İlkesi",
        "Torricelli Prensibi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-002",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Açık Hava Basıncı (Torricelli)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Torricelli deneyinde deniz seviyesinde ve 0 °C'de cıva sütununun yüksekliği kaç cm ölçülmüştür?",
    "explanation": "Deniz seviyesinde 0 °C sıcaklıkta açık hava basıncı 76 cm-Hg olarak ölçülmüştür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "66 cm",
        "70 cm",
        "76 cm",
        "80 cm"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-003",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Hareketli Makaralar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Sürtünmelerin ve makara ağırlığının ihmal edildiği hareketli bir makarada 60 N ağırlığındaki yükü kaldırmak için kaç N kuvvet uygulanmalıdır?",
    "explanation": "Hareketli makarada 2 kat kuvvet kazancı vardır: F = G / 2 = 60 / 2 = 30 N bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "15",
        "30",
        "60",
        "120"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-004",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Eğik Düzlem Hesaplama",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Boyu 6 metre, yüksekliği 2 metre olan sürtünmesiz bir eğik düzlemde kuvvet kazancı kaçtır?",
    "explanation": "Kuvvet kazancı = Eğik düzlem boyu (L) / Yükseklik (h) = 6 / 2 = 3 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-005",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Katı Basıncını Değiştirme",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki uygulamalardan hangisinde basıncı ARTIRMAK hedeflenmiştir?",
    "explanation": "Bıçağın keskinleştirilmesi temas yüzey alanını küçülterek basıncı artırır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kamyonlarda tekerlek sayısının fazla olması",
        "Bıçakların keskinleştirilmesi",
        "Ördeklerin ayaklarının perdeli olması",
        "Kar ayakkabılarının geniş tabanlı olması"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-006",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Çıkrık Sistemi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kuyu çıkrığında kol uzunluğu silindir yarıçapından büyük olduğuna göre çıkrıkla ilgili hangisi doğrudur?",
    "explanation": "Çıkrık kolu yarıçaptan büyük olduğu için kuvvet kolu > yük kolu olur ve kuvvetten kazanç sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kuvvetten kayıp vardır",
        "Kuvvetten kazanç sağlar",
        "Yoldan kazanç sağlar",
        "İş kazancı vardır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-007",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Manometre ve Gaz Basıncı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Pipetle meyve suyu içerken kutunun içe doğru büzüşmesinin temel sebebi nedir?",
    "explanation": "Pipetle hava çekildiğinde kutu içindeki gaz basıncı düşer; dışarıdaki açık hava basıncı kutuyu büzer.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İç basıncın açık hava basıncından küçük olması",
        "Sıvı yoğunluğunun azalması",
        "Yerçekimi ivmesinin artması",
        "Meyve suyunun buharlaşması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-008",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Işığın Soğurulması ve Renkler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Beyaz ışık altında mavi görünen bir kumaş parçası, karanlık bir odada sadece kırmızı ışıkla aydınlatılırsa hangi renkte görünür?",
    "explanation": "Mavi kumaş kırmızı ışığı soğurur ve yansıtmaz, bu nedenle gözlemci kumaşı siyah görür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mavi",
        "Kırmızı",
        "Beyaz",
        "Siyah"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-009",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Basit Makinelerde Verim",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Tüm basit makineler için aşağıdakilerden hangisi daima ORTAKTIR?",
    "explanation": "Hiçbir basit makine enerjiden veya işten kazanç sağlamaz; sadece iş kolaylığı sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kuvvet kazancı 1'den büyüktür",
        "Enerji veya iş kazancı kesinlikle yoktur",
        "Yoldan daima kaybettirir",
        "Destek daima ortadadır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-FIZ-M-010",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Güneş Işınlarının Geliş Açısı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "21 Mart tarihinde Ekvator'a dik gelen Güneş ışınları öğle vaktinde kaç derecelik açıyla düşer?",
    "explanation": "Ekinoks tarihlerinde (21 Mart - 23 Eylül) Güneş ışınları öğle vakti Ekvator'a tam 90° dik açıyla düşer.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "45°",
        "66.5°",
        "90°",
        "23.5°"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-001",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Fiziksel ve Kimyasal Değişimler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki olaylardan hangisi kimyasal bir değişime örnektir?",
    "explanation": "Demirin paslanması oksijenle tepkimeye girdiği için kimyasal değişimdir; diğerleri fizikseldir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Buzun erimesi",
        "Demirin paslanması",
        "Camın kırılması",
        "Tuzun suda çözünmesi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-002",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Periyodik Sistem Grupları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Periyodik tablonun 1A grubunda bulunan elementlere genel olarak ne ad verilir?",
    "explanation": "1A grubu elementleri alkali metaller, 2A toprak alkali, 7A halojen, 8A soygazlardır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Halojenler",
        "Alkali metaller",
        "Soygazlar",
        "Toprak alkali metaller"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-003",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asit ve Bazların pH Değerleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Oda sıcaklığında (25 °C) nötr bir çözeltinin pH değeri kaçtır?",
    "explanation": "25 °C sıcaklıkta saf su ve nötr çözeltilerin pH değeri 7'dir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0",
        "7",
        "10",
        "14"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-004",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Kimyasal Tepkime Temelleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kimyasal bir tepkimede aşağıdakilerden hangisi KESİNLİKLE korunur?",
    "explanation": "Kütlenin Korunumu Kanunu'na göre kimyasal tepkimelerde toplam kütle ve atom sayısı daima korunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Molekül sayısı",
        "Toplam kütle",
        "Hacim",
        "Fiziksel hâl"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-005",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asitlerin Ayıraçları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Turnusol kâğıdı asidik bir çözeltiye batırıldığında hangi renge döner?",
    "explanation": "Asitler mavi turnusolu kırmızıya çevirir, bazlar ise kırmızı turnusolu maviye çevirir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mavi",
        "Kırmızı",
        "Sarı",
        "Yeşil"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-006",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Periyodik Sistem Periyot Sayısı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Günümüz periyodik tablosunda kaç tane yatay sıra (periyot) bulunmaktadır?",
    "explanation": "Periyodik tabloda 7 periyot ve 18 grup (8 tanesi A grubu) bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "6",
        "7",
        "8"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-007",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Elementlerin Sınıflandırılması",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Isı ve elektriği iyi ileten, parlak ve tel/levha hâline gelebilen element sınıfı hangisidir?",
    "explanation": "Metaller tel ve levha haline gelebilir, ısı ve elektriği çok iyi iletir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Metaller",
        "Ametaller",
        "Soygazlar",
        "Yarı metaller"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-008",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Maddenin Halleri ve Isı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Katı bir maddenin ısı alarak doğrudan gaz hâline geçmesine ne ad verilir?",
    "explanation": "Katıdan doğrudan gaza geçiş süblimleşmedir (örn: naftalin ve kuru buz).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Buharlaşma",
        "Süblimleşme",
        "Kırağılaşma",
        "Yoğuşma"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-009",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asit Yağmurları Sebebi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki gazlardan hangisi havadaki su buharıyla birleşerek asit yağmurlarına yol açar?",
    "explanation": "Kükürt dioksit (SO₂) ve azot dioksit (NO₂) gazları sülfürik ve nitrik asit yağmurlarını oluşturur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "O₂",
        "N₂",
        "SO₂ (Kükürt dioksit)",
        "He (Helyum)"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-E-010",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Tepkimeye Girenler ve Ürünler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kimyasal bir tepkime denkleminde ok işaretinin (→) sol tarafında yer alan maddelere ne ad verilir?",
    "explanation": "Kimyasal tepkimelerde okun sol tarafındakiler girenler, sağ tarafındakiler ürünlerdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ürünler",
        "Girenler (Tepkimeye girenler)",
        "Katalizörler",
        "Çözeltiler"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-001",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Kimyasal Tepkime Hesaplaması",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "24 g magnezyum (Mg) ile 16 g oksijen (O₂) artansız birleşerek kaç g magnezyum oksit (MgO) oluşturur?",
    "explanation": "Kütlenin korunumuna göre m(MgO) = 24 + 16 = 40 g bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "32 g",
        "40 g",
        "48 g",
        "56 g"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-002",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Periyodik Tabloda Grup Bulma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Nötr bir X atomunun katman elektron dağılımı 2 - 8 - 7 şeklindedir. Bu element periyodik tabloda hangi periyot ve grupta yer alır?",
    "explanation": "3 katmanı olduğu için 3. periyot, son katmanda 7 elektron olduğu için 7A grubudur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2. Periyot 7A",
        "3. Periyot 7A",
        "3. Periyot 8A",
        "7. Periyot 3A"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-003",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asit-Baz Nötralleşme Tepkimesi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Eşit mol sayısında HCl (asit) ile NaOH (baz) sulu ortamda karıştırılırsa hangi iki madde oluşur?",
    "explanation": "HCl + NaOH → NaCl + H₂O tepkimesiyle tuz ve su (nötralleşme) meydana gelir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "NaCl (Tuz) ve H₂O (Su)",
        "H₂ gazı ve tuz",
        "Cl₂ gazı ve baz",
        "Yalnızca saf su"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-004",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Isı ve Öz Isı Hesaplaması",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Öz ısısı 0.5 J/g°C olan 100 g katı bir maddenin sıcaklığını 20 °C artırmak için kaç Joule ısı verilmelidir?",
    "explanation": "Q = m · c · ΔT = 100 · 0.5 · 20 = 1000 Joule bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "500 J",
        "1000 J",
        "2000 J",
        "2500 J"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-005",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Erime Isısı (Le)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Erime sıcaklığındaki 50 g buzu tamamen eritmek için gereken ısı kaç Joule'dür? (Le = 334 J/g)",
    "explanation": "Q = m · Le = 50 · 334 = 16700 Joule ısı gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "8350 J",
        "16700 J",
        "33400 J",
        "66800 J"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-006",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "pH Ölçeğinde Seyrelme",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "pH değeri 2 olan kuvvetli bir asit çözeltisine saf su eklendiğinde pH değeri ve hidrojen iyonu derişimi nasıl değişir?",
    "explanation": "Su eklendikçe asit seyreltilir; H⁺ derişimi düşer ve pH 7'ye yaklaşarak artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "pH artar, H⁺ derişimi azalır",
        "pH azalır, H⁺ derişimi artar",
        "İkisi de artar",
        "Değişmez"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-007",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Periyodik Özelliklerin Kıyaslanması",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aynı grupta bulunan X ve Y metallerinden X'in periyot numarası Y'den büyüktür. Buna göre hangisi KESİNLİKLE doğrudur?",
    "explanation": "Periyot numarası büyük olanın katman sayısı ve atom yarıçapı daha büyüktür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "X'in atom yarıçapı Y'den büyüktür",
        "Y'nin proton sayısı X'ten büyüktür",
        "X'in katman sayısı daha azdır",
        "Y'nin elektron vermesi daha kolaydır"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-008",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Tepkime Türleri (Yanma ve Asit-Baz)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Metan gazının oksijenle tepkimeye girerek karbondioksit ve su oluşturması (CH₄ + 2O₂ → CO₂ + 2H₂O) hangi tepkime türüdür?",
    "explanation": "Oksijen (O₂) gazı ile gerçekleşen kimyasal tepkimeler yanma tepkimesidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yanma tepkimesi",
        "Nötralleşme tepkimesi",
        "Fiziksel çözünme",
        "Sentez tepkimesi"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-009",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Hal Değişim Grafiği Yorumlama",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Saf bir maddenin sıcaklık-zaman grafiğinde sıcaklığın sabit kaldığı aralıklarda madde ile ilgili hangisi doğrudur?",
    "explanation": "Saf maddeler hal değiştirirken (erime, kaynama) sıcaklıkları sabit kalır; alınan ısı potansiyel enerjiye dönüşür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Madde hal değiştirmektedir",
        "Maddenin kütlesi azalmaktadır",
        "Maddeye ısı verilmemektedir",
        "Maddenin kimyasal yapısı değişmektedir"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-H-010",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asit Yağmurlarının pH Sınırı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Normal yağmur suyunun hafif asidik (pH ≈ 5.6) olduğu bilinmektedir. Yağışın \"asit yağmuru\" sayılması için pH değeri ne olmalıdır?",
    "explanation": "pH değeri 5.2 - 5.6'nın altına düşen yağışlar asit yağmuru olarak sınıflandırılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "pH < 5.2",
        "pH > 7.0",
        "pH = 7.0",
        "pH > 8.5"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-001",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Periyodik Sistemde Değişimler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Periyodik tabloda aynı periyotta soldan sağa doğru gidildikçe ametallik özellik ve atom numarası nasıl değişir?",
    "explanation": "Soldan sağa proton sayısı (atom no) ve elektronegatiflik/ametallik özellik artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ametallik artar, atom numarası artar",
        "Ametallik azalır, atom numarası artar",
        "İkisi de azalır",
        "Ametallik artar, atom numarası azalır"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-002",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asit ve Bazların Metallerle Tepkimesi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Asitler metallerle tepkimeye girdiğinde aşağıdaki gazlardan hangisini açığa çıkarır?",
    "explanation": "Asitler aktif metallerle (çinko, magnezyum vb.) tepkimeye girerek H₂ gazı oluşturur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "O₂ (Oksijen)",
        "H₂ (Hidrojen)",
        "CO₂ (Karbondioksit)",
        "N₂ (Azot)"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-003",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Kimyasal Tepkime Grafiği",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kapalı bir kapta gerçekleşen tepkimede maddelerin kütle-zaman grafiğinde miktarı azalan maddeler hangileridir?",
    "explanation": "Tepkime süresince girenlerin kütlesi azalır, ürünlerin kütlesi artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ürünler",
        "Tepkimeye girenler",
        "Katalizör",
        "Değişmeyenler"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-004",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Soygazların Özellikleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Periyodik tablonun 8A grubunda bulunan soygazlar (asal gazlar) ile ilgili hangisi YANLIŞTIR?",
    "explanation": "Soygazlar kararlı elektron dizilimine sahip oldukları için kural olarak bileşik oluşturmazlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Son katmanları kararlıdır",
        "Oda koşullarında tek atomlu gaz halindedirler",
        "Bileşik oluşturmaya çok isteklidirler",
        "Kimyasal tepkimelere karşı ilgisizdirler"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-005",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Fiziksel-Kimyasal Değişim Örnekleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki olaylardan hangisinde maddenin İÇ YAPISI (kimliği) değişir?",
    "explanation": "Gümüşün havadaki kükürtle tepkimeye girip kararması kimyasal bir olaydır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Gümüşün kararması",
        "Mumun erimesi",
        "Şekerin ezilerek pudra şekeri yapılması",
        "Gökkuşağı oluşumu"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-006",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Ayıraçlar ve Renk Değişimleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Metil oranj damlatıldığında sarı renk veren bir çözeltinin pH aralığı aşağıdakilerden hangisidir?",
    "explanation": "Metil oranj asitlerde kırmızı, bazlarda sarı renk verir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0 - 7 (Asidik)",
        "7 - 14 (Bazik)",
        "Yalnızca 7 (Nötr)",
        "0 - 1 (Kuvvetli asit)"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-007",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Maddenin Isı İle Etkileşimi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Isıca yalıtılmış bir kapta sıcaklıkları farklı iki sıvı karıştırıldığında ısı alışverişi ne zamana kadar devam eder?",
    "explanation": "Isı alışverişi iki maddenin sıcaklıkları eşitlenip denge sıcaklığına ulaşıncaya kadar sürer.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sıvıların kütleleri eşitlenene kadar",
        "Sıcaklıkları eşitlenene (ısıl dengeye ulaşana) kadar",
        "Biri tamamen buharlaşana kadar",
        "Öz ısıları eşitlenene kadar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-008",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Yarı Metallerin Kullanım Alanları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Silisyum (Si) ve Germanyum (Ge) gibi yarı metaller teknolojide en çok hangi alanda kullanılır?",
    "explanation": "Yarı iletken özellikleri sayesinde bilgisayar çipleri ve mikroelektronikte yaygın kullanılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Elektronik devre ve mikroçip yapımında",
        "İnşaat demiri üretiminde",
        "Plastik ambalaj sanayisinde",
        "Tekstil boyalarında"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-009",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Evsel Kimyasallar ve Tehlikeleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Tuz ruhu (HCl) ile çamaşır suyunun (NaClO) karıştırılması sonucu açığa çıkan son derece zehirli gaz hangisidir?",
    "explanation": "Tuz ruhu ve çamaşır suyu karıştırılırsa ölümcül zehirli klor gazı (Cl₂) açığa çıkar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Klor gazı (Cl₂)",
        "Oksijen gazı (O₂)",
        "Helyum gazı (He)",
        "Metan gazı (CH₄)"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-KIM-M-010",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Kütlenin Korunumu ve Atom Türü",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kapalı kapta gerçekleşen kimyasal bir tepkimede aşağıdakilerden hangisi DEĞİŞEBİLİR?",
    "explanation": "Atom sayısı, atom türü ve kütle daima korunur; ancak molekül sayısı değişebilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Toplam kütle",
        "Atom türü",
        "Toplam atom sayısı",
        "Molekül sayısı"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-001",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Çarpanlar ve Katlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "48 sayısının pozitif tam sayı bölenlerinden kaç tanesi tektir?",
    "explanation": "48 = 2⁴ · 3¹. Tek bölenleri 1 ve 3 olmak üzere 2 tanedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-002",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Üslü İfadeler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "5⁴ · 5⁻² işleminin sonucu kaçtır?",
    "explanation": "Tabanlar aynıysa üsler toplanır: 5^(4 + (-2)) = 5² = 25 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "25",
        "125",
        "625"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-003",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Kareköklü İfadeler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "√144 + √81 işleminin sonucu kaçtır?",
    "explanation": "√144 = 12 ve √81 = 9 olduğundan 12 + 9 = 21 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "19",
        "21",
        "23",
        "25"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-004",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Veri Analizi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir daire grafiğinde 360° lik açının 90° si futbol oynayanları gösteriyorsa, futbol oynayanlar tüm grubun yüzde kaçıdır?",
    "explanation": "90° / 360° = 1/4 = %25 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "%20",
        "%25",
        "%30",
        "%40"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-005",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Basit Olayların Olma Olasılığı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "1'den 10'a kadar (1 ve 10 dahil) numaralandırılmış kartlardan rastgele çekilen bir kartın asal sayı olma olasılığı kaçtır?",
    "explanation": "Asal sayılar: 2, 3, 5, 7 (4 tane). Olasılık = 4/10 = 2/5 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2/5",
        "1/2",
        "3/10",
        "3/5"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-006",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Cebirsel İfadeler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "3(2x - 4) + 5 cebirsel ifadesinin en sade eşiti nedir?",
    "explanation": "3·2x - 3·4 + 5 = 6x - 12 + 5 = 6x - 7 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6x - 7",
        "6x - 12",
        "6x + 7",
        "5x - 7"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-007",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Birinci Dereceden Denklemler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "4x - 8 = 16 olduğuna göre x kaçtır?",
    "explanation": "4x = 24 ⇒ x = 6 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "5",
        "6",
        "7"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-008",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Koordinat Sistemi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "A(-3, 4) noktası koordinat sisteminde kaçıncı bölgededir?",
    "explanation": "Apsisi negatif, ordinatı pozitif olan noktalar 2. bölgededir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1. Bölge",
        "2. Bölge",
        "3. Bölge",
        "4. Bölge"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-009",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Eğimsiz Doğrusal İlişkiler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "y = 3x doğrusunun eğimi kaçtır?",
    "explanation": "y = mx biçimindeki doğrularda eğim m katsayısıdır, yani 3'tür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1/3",
        "1",
        "2",
        "3"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-E-010",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Eşitsizlikler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "x + 3 ≤ 8 eşitsizliğini sağlayan en büyük doğal sayı kaçtır?",
    "explanation": "x ≤ 5 olduğundan en büyük doğal sayı 5 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "5",
        "6",
        "7"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-001",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Aralarında Asal Sayılar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "(2a - 1) ile (b + 3) sayıları aralarında asaldır. (2a - 1)/(b + 3) = 15/21 olduğuna göre a + b toplamı kaçtır?",
    "explanation": "15/21 kesri 3 ile sadeleştirilirse 5/7 olur. 2a - 1 = 5 ⇒ a = 3; b + 3 = 7 ⇒ b = 4. Toplam 3 + 4 = 7 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "7",
        "9",
        "11",
        "13"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-002",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Kareköklü Sayı Problemleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Alanı 180 m² olan kare şeklindeki bir bahçenin çevresi kaç metredir?",
    "explanation": "Bir kenar a = √180 = 6√5 m. Çevre = 4a = 24√5 m olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12√5",
        "24√5",
        "18√5",
        "36√5"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-003",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Olasılık ve Kombinasyon",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir torbada 4 kırmızı ve x tane mavi bilye vardır. Torbadan rastgele çekilen bir bilyenin kırmızı olma olasılığı 1/3 olduğuna göre torbadaki toplam bilye sayısı kaçtır?",
    "explanation": "4 / (4 + x) = 1/3 ⇒ 4 + x = 12 (toplam bilye sayısı 12'dir).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "8",
        "10",
        "12",
        "16"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-004",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Cebirsel Modelleme",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir kenar uzunluğu (2x + 5) cm olan kare şeklindeki kartondan, köşelerinden bir kenarı 2 cm olan 4 adet kare kesilip atılıyor. Kalan alanın cebirsel ifadesi nedir?",
    "explanation": "(2x + 5)² - 4·(2²) = 4x² + 20x + 25 - 16 = 4x² + 20x + 9 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4x² + 20x + 9",
        "4x² + 20x + 21",
        "4x² + 10x + 9",
        "4x² + 25"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-005",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Silindirin Hacmi ve Yüzey Alanı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Taban yarıçapı r = 3 cm ve yüksekliği h = 10 cm olan dik dairesel silindirin hacmi kaç cm³'tür? (π = 3 alınız)",
    "explanation": "V = π · r² · h = 3 · 3² · 10 = 3 · 9 · 10 = 270 cm³ bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "180",
        "270",
        "360",
        "540"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-006",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Benzerlik ve Teorem",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Gölgesi 12 metre olan 3 metre boyundaki bir ağacın yanında duran 1.5 metre boyundaki bir çocuğun gölgesi kaç metre olur?",
    "explanation": "3 / 12 = 1.5 / x ⇒ x = 6 metre bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "5",
        "6",
        "8"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-007",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Prizmalar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Ayrıt uzunlukları 4 cm, 6 cm ve 8 cm olan dikdörtgenler prizmasının toplam yüzey alanı kaç cm²'dir?",
    "explanation": "A = 2(ab + bc + ac) = 2(24 + 48 + 32) = 2(104) = 208 cm² olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "104",
        "188",
        "208",
        "216"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-008",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Doğrusal Eşitsizlik Grafikleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "2x - y ≥ 4 eşitsizliği aşağıdaki noktalardan hangisi tarafından SAĞLANMAZ?",
    "explanation": "(1, 2) için 2(1) - 2 = 0 ≥ 4 yanlış bir önermedir, eşitsizliği sağlamaz.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "(3, 1)",
        "(4, 2)",
        "(2, -1)",
        "(1, 2)"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-009",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Koni Ana Doğrusu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Taban yarıçapı 6 cm ve yüksekliği 8 cm olan dik dairesel koninin ana doğru (yanal ayrıt) uzunluğu kaç cm'dir?",
    "explanation": "a² = r² + h² = 6² + 8² = 36 + 64 = 100 ⇒ a = 10 cm (6-8-10 üçgeni).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "9",
        "10",
        "12",
        "14"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-H-010",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Üslü Sayı Denklemleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "2^(x+3) = 64 olduğuna göre 3^(x-1) ifadesinin değeri kaçtır?",
    "explanation": "64 = 2⁶ ⇒ x + 3 = 6 ⇒ x = 3. 3^(3-1) = 3² = 9 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "9",
        "27",
        "81"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-001",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "EBOB - EKOK",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kenar uzunlukları 12 cm ve 18 cm olan dikdörtgen levhalar yan yana dizilerek en küçük boyutlu bir kare yapılacaktır. Karenin bir kenarı kaç cm olur?",
    "explanation": "EKOK(12, 18) = 36 cm bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "24",
        "36",
        "48",
        "72"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-002",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Kareköklü İfadelerde Çarpma",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "√18 · √8 işleminin sonucu kaçtır?",
    "explanation": "3√2 · 2√2 = 6 · 2 = 12 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10",
        "12",
        "14",
        "16"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-003",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Bilimsel Gösterim",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "0,000045 sayısının bilimsel gösterimi aşağıdakilerden hangisidir?",
    "explanation": "Virgül 5 basamak sağa kaydırılırsa 4,5 · 10⁻⁵ elde edilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4,5 · 10⁻⁴",
        "4,5 · 10⁻⁵",
        "45 · 10⁻⁶",
        "0,45 · 10⁻⁴"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-004",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Özdeşlikler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "(2x + 3)² ifadesinin özdeşi aşağıdakilerden hangisidir?",
    "explanation": "(a+b)² = a² + 2ab + b² ⇒ (2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4x² + 9",
        "4x² + 6x + 9",
        "4x² + 12x + 9",
        "2x² + 12x + 9"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-005",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "İki Kare Farkı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "x² - 49 ifadesinin çarpanlarına ayrılmış hali nedir?",
    "explanation": "a² - b² = (a-b)(a+b) kuralından (x-7)(x+7) olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "(x - 7)²",
        "(x - 7)(x + 7)",
        "(x - 49)(x + 1)",
        "(x - 14)(x + 14)"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-006",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Üçgende Kenarortay ve Açıortay",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Çeşitkenar bir üçgende aynı köşeden çizilen yükseklik (h), açıortay (n) ve kenarortay (V) uzunlukları arasındaki sıralama nasıldır?",
    "explanation": "Daima en kısa olan yüksekliktir: h < n < V kuralı geçerlidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "h < n < V",
        "V < n < h",
        "h < V < n",
        "n < h < V"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-007",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Pisagor Bağıntısı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Dik kenar uzunlukları 5 cm ve 12 cm olan bir dik üçgenin hipotenüs uzunluğu kaç cm'dir?",
    "explanation": "5-12-13 özel dik üçgenidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "13",
        "14",
        "15",
        "17"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-008",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Üçgen Eşitsizliği",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İki kenar uzunluğu 6 cm ve 9 cm olan bir üçgenin üçüncü kenarının alabileceği kaç farklı tam sayı değeri vardır?",
    "explanation": "|9 - 6| < x < 9 + 6 ⇒ 3 < x < 15. Değerler 4'ten 14'e kadar 11 tanedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "9",
        "10",
        "11",
        "12"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-009",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Doğrusal Denklemlerin Grafiği",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "2x + 3y = 12 doğrusunun y eksenini kestiği noktanın ordinatı kaçtır?",
    "explanation": "x = 0 için 3y = 12 ⇒ y = 4 noktasında keser.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-MAT-M-010",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Benzerlik Oranı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Benzerlik oranı 2/3 olan iki benzer üçgenin alanları oranı kaçtır?",
    "explanation": "Alanlar oranı benzerlik oranının karesine eşittir: (2/3)² = 4/9 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2/3",
        "4/9",
        "8/27",
        "1/3"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-001",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Bir Kahraman Doğuyor (Selanik)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Mustafa Kemal'in doğup büyüdüğü Selanik şehrinin zengin bir kültürel yapıya ve canlı bir ticaret ortamına sahip olmasının en önemli nedeni nedir?",
    "explanation": "Selanik; işlek bir limana, Avrupa'ya bağlanan demir yoluna ve çok uluslu kozmopolit bir yapıya sahipti.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Deniz kıyısında işlek bir limana ve Avrupa'ya bağlanan demiryoluna sahip olması",
        "Yalnızca tarımla geçinmesi",
        "Askeri okulların bulunmaması",
        "Başkent olması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-002",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Mustafa Kemal'in Askerlik Hayatı (Trablusgarp)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Mustafa Kemal'in sömürgeci İtalya'ya karşı Derne ve Tobruk'ta yerli halkı örgütleyerek kazandığı ilk askeri başarı hangi savaştır?",
    "explanation": "1911 Trablusgarp Savaşı Mustafa Kemal'in ilk askeri başarısıdır ve teşkilatçılık yeteneğini gösterir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Balkan Savaşı",
        "Trablusgarp Savaşı",
        "Çanakkale Savaşı",
        "Sakarya Meydan Muharebesi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-003",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Millî Uyanış (Samsun'a Çıkış)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Mustafa Kemal Millî Mücadele'yi fiilen başlatmak amacıyla hangi tarihte Samsun'a çıkmıştır?",
    "explanation": "Mustafa Kemal, 19 Mayıs 1919'da 9. Ordu Müfettişi olarak Bandırma Vapuru ile Samsun'a çıkmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "23 Nisan 1920",
        "19 Mayıs 1919",
        "29 Ekim 1923",
        "30 Ağustos 1922"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-004",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Genelgeler (Amasya Genelgesi)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.\" kararı ilk kez hangi belgede yer almıştır?",
    "explanation": "Amasya Genelgesi (22 Haziran 1919), Kurtuluş Savaşı'nın gerekçesini, amacını ve yöntemini ilk kez belirten ihtilal beyannamesidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Amasya Genelgesi",
        "Havza Genelgesi",
        "Erzurum Kongresi",
        "Misak-ı Millî"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-005",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Kongreler (Sivas Kongresi)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yurdun dört bir yanındaki Millî Mücadele cemiyetleri hangi kongrede \"Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti\" adı altında birleştirilmiştir?",
    "explanation": "Sivas Kongresi'nde tüm milli cemiyetler tek çatı altında birleştirilerek Millî Mücadele tek merkezden yönetilmiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Erzurum Kongresi",
        "Amasya Genelgesi",
        "Sivas Kongresi",
        "Balıkesir Kongresi"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-006",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "TBMM'nin Açılışı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Türkiye Büyük Millet Meclisi (TBMM) hangi tarihte Ankara'da açılarak millî iradeyi temsil etmeye başlamıştır?",
    "explanation": "23 Nisan 1920 tarihinde TBMM Hacı Bayram Camii'nde kılınan cuma namazı sonrası dualarla açılmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "19 Mayıs 1919",
        "23 Nisan 1920",
        "29 Ekim 1923",
        "12 Ocak 1920"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-007",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Batı Cephesi (Sakarya)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır.\" tarihi emri Mustafa Kemal tarafından hangi savaşta verilmiştir?",
    "explanation": "Sakarya Meydan Muharebesi'nde (1921) Mustafa Kemal bu emri vererek topyekûn savunma taktiğini uygulamıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "I. İnönü Muharebesi",
        "II. İnönü Muharebesi",
        "Sakarya Meydan Muharebesi",
        "Büyük Taarruz"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-008",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Atatürk İlkeleri (Cumhuriyetçilik)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Egemenliğin kayıtsız şartsız millete ait olmasını, halkın kendi yöneticilerini seçimle belirlemesini esas alan Atatürk ilkesi hangisidir?",
    "explanation": "Cumhuriyetçilik, devlet yönetiminde halk iradesini ve seçimi temel alan ilkedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Cumhuriyetçilik",
        "Devletçilik",
        "Milliyetçilik",
        "Laiklik"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-009",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Atatürk İlkeleri (Laiklik)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Din ve devlet işlerinin birbirinden ayrılmasını, akıl ve bilimin rehber edinilmesini savunan ilke hangisidir?",
    "explanation": "Laiklik; vicdan özgürlüğünü, din ve devlet işlerinin ayrılmasını ve aklın egemenliğini öngörür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Halkçılık",
        "Laiklik",
        "Devletçilik",
        "İnkılapçılık"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-E-010",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Lozan Barış Antlaşması",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yeni Türk devletinin bağımsızlığının ve sınırlarının dünya devletlerince resmen tanındığı uluslararası antlaşma hangisidir?",
    "explanation": "24 Temmuz 1923'te imzalanan Lozan Antlaşması Türkiye Cumhuriyeti'nin tapu senedidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sevr Antlaşması",
        "Mondros Ateşkesi",
        "Lozan Barış Antlaşması",
        "Gümrü Antlaşması"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-001",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Mustafa Kemal'in Fikir Hayatını Etkileyenler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Mustafa Kemal'in fikir hayatında \"vatan ve hürriyet şairi\" olarak andığı Namık Kemal ile \"Türkçülük ve milliyetçilik\" fikirlerini benimsediği Ziya Gökalp onun hangi yönünün gelişiminde belirleyici olmuştur?",
    "explanation": "Namık Kemal vatan sevgisini, Ziya Gökalp ve Mehmet Emin Yurdakul ise Türk milliyetçiliği fikrini aşılamıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Batı müziğine ilgisinde",
        "Vatanseverlik ve milliyetçilik bilincinin şekillenmesinde",
        "Yalnızca fen bilimlerine yönelmesinde",
        "Diplomatik dil öğrenmesinde"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-002",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Mondros Ateşkes Antlaşması'nın 7. ve 24. Maddeleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Mondros'un \"İtilaf Devletleri güvenliklerini tehdit eden herhangi bir stratejik noktayı işgal edebilecektir\" (7. madde) ve \"Vilayat-ı Sitte'de karışıklık çıkarsa işgal edilecektir\" (24. madde) maddelerinin asıl gizli amacı nedir?",
    "explanation": "7. madde tüm Anadolu işgalleri için bahane hazırlanmasını, 24. madde ise Doğu Anadolu'da Ermeni devleti kurulmasını hedeflemiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Anadolu'yu işgale açık hâle getirmek ve Doğu'da bir Ermeni devleti kurmak",
        "Osmanlı'ya yardım etmek",
        "Boğazları korumak",
        "Demiryollarını geliştirmek"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-003",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Amasya Görüşmeleri ve Temsil Heyeti",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "İstanbul Hükûmeti'nin temsilcisi Salih Paşa ile Temsil Heyeti adına Mustafa Kemal arasında yapılan Amasya Görüşmeleri'nin (Ekim 1919) en önemli siyasî sonucu nedir?",
    "explanation": "Amasya Görüşmeleri ile İstanbul Hükûmeti, Temsil Heyeti'nin varlığını resmen ve hukuken ilk kez kabul etmiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İstanbul Hükûmeti, Temsil Heyeti'ni hukuken ve resmen tanımıştır",
        "İstanbul Hükûmeti istifa etmiştir",
        "Kuvâ-yı Millîye feshedilmiştir",
        "Lozan Antlaşması imzalanmıştır"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-004",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Sevr Antlaşması'nın Hukuken Geçersizliği",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "10 Ağustos 1920'de imzalanan Sevr Antlaşması'nın hukuken geçersiz (ölü doğmuş bir antlaşma) sayılmasının anayasal gerekçesi nedir?",
    "explanation": "Kânûn-ı Esâsî'ye göre uluslararası antlaşmalar Mebusan Meclisi onayından geçmelidir; meclis kapalı olduğundan hukuken geçersizdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Padişah tarafından imzalanmaması",
        "Osmanlı Mebusan Meclisi tarafından onaylanmamış olması",
        "Yunanistan'ın antlaşmayı reddetmesi",
        "Fransa'nın çekilmesi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-005",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "I. İnönü Muharebesi'nin Sonuçları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "TBMM ordularının kazandığı I. İnönü Zaferi sonrası iç ve dış politikada yaşanan aşağıdaki gelişmelerden hangisi bu zaferin diplomatik sonucudur?",
    "explanation": "Londra Konferansı ile İtilaf Devletleri TBMM'yi ilk kez resmen tanımış, Sovyet Rusya ile Moskova Antlaşması imzalanmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İstiklal Marşı'nın kabul edilmesi",
        "Teşkilat-ı Esasiye Kanunu'nun kabulü",
        "Londra Konferansı'nın toplanması ve Moskova Antlaşması",
        "Mustafa Kemal'e mareşallik unvanı verilmesi"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-006",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Mudanya Ateşkes Antlaşması",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Mudanya Ateşkes Antlaşması ile Doğu Trakya, Boğazlar ve İstanbul savaş yapılmadan diplomatik yolla kurtarılmıştır. Bu durum aşağıdakilerden hangisini doğrudan kanıtlar?",
    "explanation": "İstanbul ve Boğazların TBMM idaresine devredilmesiyle Osmanlı Devleti hukuken sona ermiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Osmanlı Hükûmeti'nin hukuken sona erdiğini ve askeri zaferin diplomatik zafere dönüştüğünü",
        "Yunanistan'ın savaşı kazandığını",
        "İtilaf Devletleri'nin Sevr'i uyguladığını",
        "TBMM'nin kapitülasyonları kabul ettiğini"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-007",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Çok Partili Hayata Geçiş ve Muhalefet Partileri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Cumhuriyet döneminin ilk muhalefet partisi olan Terakkiperver Cumhuriyet Fırkası'nın kurucuları arasında kimler yer almıştır?",
    "explanation": "Millî Mücadele komutanlarından Kazım Karabekir liderliğinde 1924'te Terakkiperver Cumhuriyet Fırkası kurulmuştur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kazım Karabekir, Rauf Orbay, Refet Bele ve Ali Fuat Cebesoy",
        "Fethi Okyar ve İsmet İnönü",
        "Celal Bayar ve Adnan Menderes",
        "Namık Kemal ve Şinasi"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-008",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Atatürk İlkeleri (Devletçilik)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Özel sektörün yetersiz kaldığı alanlarda büyük sanayi ve altyapı yatırımlarının bizzat devlet eliyle yapılmasını, I. Beş Yıllık Sanayi Planı'nın uygulanmasını esas alan ilke hangisidir?",
    "explanation": "Devletçilik; özel teşebbüsü reddetmez ancak stratejik ve büyük yatırımları devlet eliyle yürütmeyi öngörür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Devletçilik",
        "Cumhuriyetçilik",
        "Laiklik",
        "İnkılapçılık"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-009",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Balkan Antantı ve Sadabat Paktı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "1930'lu yıllarda İtalya ve Almanya'nın saldırgan yayılmacı politikalarına karşı Türkiye'nin Batı ve Doğu sınırlarının güvenliğini sağlamak için imzaladığı uluslararası güvenlik antlaşmaları hangileridir?",
    "explanation": "Türkiye 1934'te Balkan Antantı ile batı sınırını, 1937'de Sadabat Paktı ile doğu sınırını güvenceye almıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Balkan Antantı (Batı sınırı) ve Sadabat Paktı (Doğu sınırı)",
        "Varşova Paktı ve NATO",
        "Cenevre Sözleşmesi ve Paris Paktı",
        "Gümrü ve Kars Antlaşmaları"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-H-010",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Hatay'ın Anavatana Katılması (1939)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Mustafa Kemal'in \"Kırk asırlık Türk yurdu düşman elinde esir kalamaz\" ve \"Şahsi meselem\" dediği diplomasi zaferi nedir?",
    "explanation": "Mustafa Kemal'in yoğun çabalarıyla Hatay bağımsız olmuş ve 1939'da Meclis kararıyla Türkiye Cumhuriyeti'ne katılmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Musul'un fethi",
        "Hatay'ın anavatana katılması",
        "Kıbrıs Barış Harekâtı",
        "Batum'un alınması"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-001",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "I. Dünya Savaşı ve Osmanlı Devleti",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Osmanlı Devleti'nin I. Dünya Savaşı'nda İngiltere'nin sömürgelerine giden yolları kesmek amacıyla açtığı taarruz cephesi hangisidir?",
    "explanation": "Kanal Cephesi ve Kafkas Cephesi Osmanlı'nın taarruz cepheleridir; Kanal Cephesi Süveyş Kanalı ve Mısır'ı hedeflemiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Çanakkale Cephesi",
        "Kanal (Süveyş) Cephesi",
        "Irak Cephesi",
        "Kafkas Cephesi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-002",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Kuvâ-yı Millîye Ruhu",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Mondros Ateşkes Antlaşması'ndan sonra yurdun işgal edilmesi ve Osmanlı ordusunun terhis edilmesi üzerine halkın kurduğu bölgesel silahlı direniş birliklerine ne ad verilir?",
    "explanation": "Kuvâ-yı Millîye, işgallere karşı halkın vatanı savunmak için oluşturduğu milis kuvvetlerdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Nizam-ı Cedid",
        "Kuvâ-yı Millîye",
        "Eşkinci Ocağı",
        "Sekban-ı Cedid"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-003",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Erzurum Kongresi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Erzurum Kongresi'nin toplanış şekli bakımından bölgesel, aldığı kararlar bakımından ulusal nitelikte olmasının temel kanıtı nedir?",
    "explanation": "Doğu illerinden temsilcilerle toplanmasına rağmen tüm yurdu ilgilendiren kararlar almıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sadece Doğu illerinden delegelerin katılması ancak \"Millî sınırlar içinde vatan bir bütündür, bölünemez\" kararının alınması",
        "İstanbul Hükûmeti'nin kongreyi desteklemesi",
        "Padişahın kongreye başkanlık etmesi",
        "Yalnızca Ermeni tehlikesinin görüşülmesi"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-004",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Misak-ı Millî Kararları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Son Osmanlı Mebusan Meclisi tarafından 28 Ocak 1920'de kabul edilen ve Türk milletinin bağımsızlık sınırlarını çizen tarihî belge hangisidir?",
    "explanation": "Misak-ı Millî, kapitülasyonların reddedildiği ve vatanın bölünmez sınırlarının çizildiği milli anddır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Teşkilat-ı Esasiye",
        "Misak-ı Millî (Millî Ant)",
        "Kânûn-ı Esâsî",
        "Sened-i İttifak"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-005",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Doğu Cephesi ve Gümrü Antlaşması",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "TBMM Hükûmeti'nin uluslararası alandaki ilk askerî ve siyasî başarısı olup Ermenistan ile imzalanan antlaşma hangisidir?",
    "explanation": "Kazım Karabekir komutasındaki 15. Kolordu'nun zaferi sonrası imzalanan Gümrü Antlaşması TBMM'nin ilk diplomatik zaferidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Moskova Antlaşması",
        "Kars Antlaşması",
        "Gümrü Antlaşması",
        "Ankara Antlaşması"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-006",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Tekâlif-i Milliye Emirleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Mustafa Kemal, Kütahya-Eskişehir Muharebeleri sonrası ordunun acil ihtiyaçlarını karşılamak amacıyla geniş yetkilerine dayanarak hangi emirleri yayımlamıştır?",
    "explanation": "Başkomutan Mustafa Kemal, Türk milletini topyekûn seferber eden Tekâlif-i Milliye emirlerini yayımlamıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Teşvik-i Sanayi Emirleri",
        "Tekâlif-i Milliye Emirleri",
        "Misak-ı İktisadi Kararları",
        "Vilayat-ı Sitte Kanunu"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-007",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Atatürk İlkeleri (Halkçılık)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Toplumda hiçbir zümreye, aileye veya sınıfa ayrıcalık tanınmamasını, kanun önünde eşitliği ve sosyal adaleti savunan Atatürk ilkesi hangisidir?",
    "explanation": "Aşar vergisinin kaldırılması, Soyadı Kanunu ve kadınlara seçme-seçilme hakkı verilmesi doğrudan Halkçılık ilkesiyle ilgilidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Halkçılık",
        "Devletçilik",
        "İnkılapçılık",
        "Milliyetçilik"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-008",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Eğitim Alanında İnkılaplar (Tevhid-i Tedrisat)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "3 Mart 1924 tarihinde çıkarılan Tevhid-i Tedrisat Kanunu ile eğitim sisteminde ne amaçlanmıştır?",
    "explanation": "Tevhid-i Tedrisat ile medreseler kapatılmış, tüm okullar MEB çatısı altında birleştirilerek eğitimde ikilik sona erdirilmiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tüm eğitim kurumlarının Millî Eğitim Bakanlığı'na bağlanarak eğitimin birleştirilmesi ve millileştirilmesi",
        "Yalnızca askeri okulların açılması",
        "Eğitimin ücretli hale getirilmesi",
        "Yabancı okullara ayrıcalık tanınması"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-009",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Ekonomi Alanında İnkılaplar (Kabotaj Kanunu)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "1 Temmuz 1926'da yürürlüğe giren Kabotaj Kanunu ile Türk denizlerinde yük ve yolcu taşıma hakkı kime devredilmiştir?",
    "explanation": "Kabotaj Kanunu Türk karasularındaki egemenliğimizi pekiştirmiş ve Milliyetçilik ilkesini yansıtmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yabancı şirketlere",
        "Yalnızca Türk denizcilerine ve Türk bayraklı gemilere",
        "Liman işletmelerine",
        "Osmanlı Bankası'na"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-SOS-M-010",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Atatürk Dönemi Dış Politika (Montrö)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "1936 yılında imzalanan Montrö Boğazlar Sözleşmesi ile Türkiye hangi büyük kazanımı elde etmiştir?",
    "explanation": "Montrö ile Boğazlar Komisyonu kaldırılmış ve Türk ordusu Boğazlar bölgesine girerek tam egemenlik sağlamıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Boğazlar Komisyonu kaldırılarak Boğazların yönetimi ve savunması tamamen Türkiye'ye geçmiştir",
        "Boğazlar uluslararası yönetime bırakılmıştır",
        "Boğazlar tamamen ulaşıma kapatılmıştır",
        "Yabancı devletlere üs verilmiştir"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-001",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Sözcükte Anlam (Gerçek - Mecaz)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Bize karşı çok soğuk davrandı.\" cümlesindeki \"soğuk\" sözcüğü hangi anlamda kullanılmıştır?",
    "explanation": "Isı derecesi anlamından tamamen uzaklaşarak \"ilgisiz, sevgisiz\" anlamında mecazlaşmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Gerçek anlam",
        "Mecaz anlam",
        "Terim anlam",
        "Zıt anlam"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-002",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Eş Anlamlı (Anlamdaş) Sözcükler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Görev\" sözcüğünün eş anlamlısı aşağıdakilerden hangisidir?",
    "explanation": "\"Görev\" ile \"vazife\" aynı anlama gelen eş anlamlı sözcüklerdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Amaç",
        "Vazife",
        "Sebep",
        "Sonuç"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-003",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Deyimler ve Atasözleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki deyimlerden hangisi \"çok sevinmek, mutlu olmak\" anlamında kullanılır?",
    "explanation": "\"Etekleri zil çalmak\" büyük bir neşe ve sevinç duymak demektir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Etekleri tutuşmak",
        "Etekleri zil çalmak",
        "Gözden düşmek",
        "Pabucu dama atılmak"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-004",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümlede Anlam (Neden - Sonuç)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerin hangisinde \"neden-sonuç (sebep-sonuç)\" ilişkisi vardır?",
    "explanation": "Yolların kapanması bir sonuç, karın yağması ise bunun gerçekleşmiş gerekçesidir (nedenidir).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ders çalışmak için odasına çekildi.",
        "Kar yağdığı için yollar kapandı.",
        "Erken yatarsa sabah dinç uyanır.",
        "Kitap okumayı çok seviyor."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-005",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümlede Anlam (Öznel - Nesnel)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerden hangisi kanıtlanabilirlik açısından \"nesnel\" bir yargıdır?",
    "explanation": "Başkentin Ankara olması kişiden kişiye değişmeyen, doğruluğu kanıtlanabilir nesnel bir bilgidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "En güzel mevsim sonbahardır.",
        "Türkiye'nin başkenti Ankara'dır.",
        "Bu roman herkesi derinden etkiler.",
        "Mavi renk insana huzur verir."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-006",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Fiilimsiler (İsim-Fiil)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki altı çizili sözcüklerden hangisi bir \"isim-fiil\"dir (mastar)?",
    "explanation": "\"Gülüşü\" sözcüğündeki -üş eki isim-fiil ekidir (-ma, -ış, -mak).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Gülüşü herkese neşe saçıyordu.",
        "Koşan çocuk yere düştü.",
        "Gidip hemen geri döndü.",
        "Yıkılmış binalar gördük."
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-007",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Noktalama İşaretleri (Nokta ve Virgül)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerin hangisinde virgül (,) eş görevli sözcükleri ayırmak için kullanılmıştır?",
    "explanation": "Elma, armut ve portakal aynı görevdeki nesnelerdir; virgül bunları ayırmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Pazardan elma, armut, portakal aldık.",
        "Ali, dün bize geleceğini söylemişti.",
        "Evet, bu teklifi kabul ediyorum.",
        "Akşam, yine akşam, yine akşam..."
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-008",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Yazım Kuralları (de / da Bağlacı)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerin hangisinde \"de / da\"nın yazımı DOĞRUDUR?",
    "explanation": "\"Ahmet de\" cümlesinde \"de\" bağlaçtır ve ayrı yazılması kurala uygundur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sende bizimle gelsene.",
        "Kitap da çok güzel bilgiler var.",
        "Ahmet de bu yarışmaya katılacak.",
        "Ev de hiç tuz kalmamış."
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-009",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümlenin Ögeleri (Yüklem ve Özne)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Küçük çocuk bahçede neşeyle koşuyordu.\" cümlesinin öznesi aşağıdakilerden hangisidir?",
    "explanation": "Koşan kim? \"Küçük çocuk\" cümlenin öznesidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Bahçede",
        "Neşeyle",
        "Küçük çocuk",
        "Koşuyordu"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-E-010",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Metin Türleri (Hikâye / Öykü)",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Olmuş ya da olması mümkün olayların kişi, yer ve zamana bağlı olarak anlatıldığı kısa metin türü hangisidir?",
    "explanation": "Olay, kişi, zaman ve mekân unsurlarını içeren edebi metin hikayedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Makale",
        "Hikâye (Öykü)",
        "Deneme",
        "Fıkra"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-001",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Fiilde Çatı (Etken - Edilgen - Dönüşlü)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Okul bahçesindeki çöpler görevlilerce temizlendi.\" cümlesindeki fiilin çatı özelliği nedir?",
    "explanation": "İşi yapan belli değildir (-n edilgenlik eki almıştır) ve \"onu temizlendi\" denilemediğinden geçişsizdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Etken - Geçişli",
        "Edilgen - Geçişsiz",
        "Dönüşlü - Geçişli",
        "İşteş - Geçişsiz"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-002",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümle Türleri (Biçimce ve Anlamca)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Bu güzel havada evde oturulur mu hiç?\" cümlesinin yapısı ve anlamı aşağıdakilerden hangisidir?",
    "explanation": "Cümlede olumsuzluk eki yoktur (biçimce olumlu), ancak kastedilen \"oturulmaz\"dır (anlamca olumsuz).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Biçimce olumlu, anlamca olumsuz soru cümlesi",
        "Biçimce ve anlamca olumlu",
        "Biçimce olumsuz, anlamca olumlu",
        "Biçimce ve anlamca olumsuz"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-003",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Anlatım Bozuklukları (Özne-Yüklem Uyumsuzluğu)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Herkes içeri girdi, tek kelime etmedi.\" cümlesindeki anlatım bozukluğunun nedeni nedir?",
    "explanation": "\"Herkes\" olumlu öznedir; ikinci cümlenin yüklemi olumsuz olduğundan \"hiç kimse\" öznesi gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Özne eksikliği (Hiç kimse tek kelime etmedi)",
        "Nesne eksikliği",
        "Tümleç uyuşmazlığı",
        "Yüklem eksikliği"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-004",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Mantık ve Muhakeme (Sözel Mantık)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "A, B, C ve D isimli dört arkadaş bir yarışta ilk dört dereceyi paylaşmıştır. A sonuncu değildir, B birinci veya ikinci olmuştur, C ise B'den hemen sonra gelmiştir. D kaçıncı olmuştur?",
    "explanation": "B 1. ise C 2., A 3., D 4. olur (A sonuncu olamayacağı için D 4. sıradadır).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1.",
        "2.",
        "3.",
        "4."
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-005",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Düşünceyi Geliştirme Yolları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Yazarın savunduğu düşünceyi desteklemek için alanında tanınmış güvenilir bir kişinin sözünü aynen aktarmasına ne ad verilir?",
    "explanation": "Kişinin adı ve tırnak içinde sözünün aktarılması tanık göstermedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tanık gösterme",
        "Örneklendirme",
        "Karşılaştırma",
        "Benzetme"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-006",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Kalıplaşmış Fiilimsiler (Kalıcı İsim)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aşağıdaki altı çizili sözcüklerden hangisi fiilimsi ekini alarak kalıcı bir ada (isme) dönüşmüştür?",
    "explanation": "\"Sarma\" sözcüğü artık bir yiyeceğin kalıcı adı olmuştur, fiilimsi özelliğini yitirmiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Annemin yaptığı sarma çok lezzetliydi.",
        "Etrafa su saçma sakın.",
        "Koşarak gelen çocuğu gördüm.",
        "Gülümseyen gözlerle baktı."
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-007",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Noktalama İşaretleri (Tırnak ve Yay Ayraç)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Cümle içinde başka bir kimseden veya yazıdan olduğu gibi aktarılan sözlerin başına ve sonuna hangi işaret konur?",
    "explanation": "Doğrudan aktarma cümleleri tırnak işareti içine alınır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tırnak işareti (\" \")",
        "Yay ayraç (( ))",
        "Köşeli ayraç ([ ])",
        "Kesme işareti (')"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-008",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Yazım Kuralları (Birleşik Sözcükler)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aşağıdaki cümlelerin hangisinde birleşik sözcüklerin yazımı ile ilgili bir YANLIŞLIK yapılmıştır?",
    "explanation": "Ses düşmesi veya türemesi olmayan birleşik fiiller ayrı yazılır: \"fark etti\" olmalıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Bu olayı farkettiğimde çok geçti.",
        "Soruları çözmeyi terk etti.",
        "Tüm teklifleri reddetti.",
        "Ona yardım etti."
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-009",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Paragrafta Anlatım Biçimleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Okuyucunun bir konudaki fikrini değiştirmek, kendi görüşünü kabul ettirmek amacıyla yazılan anlatım biçimi hangisidir?",
    "explanation": "Fikir aşılama ve kanıları değiştirme gayesi taşıyan anlatım tartışmacı anlatımdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Açıklama",
        "Öyküleme",
        "Tartışma",
        "Betimleme"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-H-010",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Ses Olayları (Ünlü Düşmesi ve Ünsüz Yumuşaması)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Ağzındaki baklayı nihayet çıkardı.\" cümlesindeki altı çizili sözcükte (ağzındaki) hangi ses olayı vardır?",
    "explanation": "\"Ağız\" sözcüğüne ünlüyle başlayan ek gelince ikinci hecedeki dar ünlü düşmüştür (ağzı).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ünsüz benzeşmesi",
        "Ünlü düşmesi (ağız -> ağzı)",
        "Ünlü daralması",
        "Ünsüz türemesi"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-001",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Fiilimsiler (Sıfat-Fiil ve Zarf-Fiil)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Sararmış yapraklar rüzgâr estikçe etrafa savruluyordu.\" cümlesindeki fiilimsilerin türü sırasıyla nedir?",
    "explanation": "\"Sararmış yaprak\" sıfat-fiil (-miş), \"estikçe\" zarf-fiildir (-dıkça).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İsim-fiil, Sıfat-fiil",
        "Sıfat-fiil, Zarf-fiil",
        "Zarf-fiil, İsim-fiil",
        "Sıfat-fiil, İsim-fiil"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-002",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümle Türleri (Yapısına Göre)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "İçinde en az bir fiilimsi bulunan ve tek yüklemi olan cümlelere ne ad verilir?",
    "explanation": "Tek yüklemli olup içinde fiilimsi barındıran cümleler birleşik (fiilimsili) cümlelerdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Basit cümle",
        "Fiilimsi bulunan (Birleşik) cümle",
        "Sıralı cümle",
        "Bağlı cümle"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-003",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümlenin Ögeleri (Nesne ve Tümleçler)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Öğretmenimiz dün sınıfta bize çok güzel bir kitap okudu.\" cümlesinde aşağıdaki ögelerden hangisi YOKTUR?",
    "explanation": "Cümlede fiilimsi (zarf fiil) bulunmamaktadır. Ögeler: Özne, Zarf T., Yer T., Dolaylı T., Nesne, Yüklem.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Özne",
        "Zarf Tamlayıcısı",
        "Yer Tamlayıcısı",
        "Zarf Fiil"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-004",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Cümlede Vurgu",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Fiil cümlelerinde vurgu kural olarak hangi ögenin üzerindedir?",
    "explanation": "Yüklemi fiil olan cümlelerde vurgu yüklemden bir önceki ögededir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yüklemden hemen önceki ögede",
        "Cümlenin ilk ögesinde",
        "Öznede",
        "Yüklemin kendisinde"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-005",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Söz Sanatları (Teşhis ve Teşbih)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Hırçın bir rüzgâr dağların ardından öfkeyle haykırıyordu.\" cümlesinde hangi söz sanatı ağır basmaktadır?",
    "explanation": "İnsana özgü öfkelenme ve haykırma özelliği rüzgara aktarılarak kişileştirme yapılmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Teşhis (Kişileştirme)",
        "Tezat (Karşıtlık)",
        "Abartma (Mübalağa)",
        "Benzetme (Teşbih)"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-006",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Metinde Ana Fikir (Ana Düşünce)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir paragrafta yazarın okuyucuya vermek istediği asıl iletiye veya mesaja ne ad verilir?",
    "explanation": "Yazarın metni yazma amacı ve temel iletisi ana fikirdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Konu",
        "Ana düşünce (Ana fikir)",
        "Başlık",
        "Yardımcı düşünce"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-007",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Noktalama İşaretleri (Noktalı Virgül ve İki Nokta)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kendisinden sonra örnek verilecek veya açıklama yapılacak cümlenin sonuna hangi noktalama işareti konur?",
    "explanation": "Açıklama veya örnek verilecek yerlerde iki nokta (:) kullanılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Noktalı virgül (;)",
        "İki nokta (:)",
        "Üç nokta (...)",
        "Virgül (,)"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-008",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Yazım Kuralları (Büyük Harflerin Kullanımı)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki cümlelerin hangisinde büyük harflerin yazımıyla ilgili bir YANLIŞLIK yapılmıştır?",
    "explanation": "Kişi adlarından sonra gelen unvan ve saygı sözcükleri büyük harfle başlar: \"Ahmet Bey\" olmalıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Van Gölü Türkiye'nin en büyük gölüdür.",
        "Her yıl 29 Ekim Cumhuriyet Bayramı coşkuyla kutlanır.",
        "Bu akşam Ay tutulması izlenecek.",
        "Dün ahmet bey ile görüştük."
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-009",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Paragrafta Anlatım Biçimleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir yerin, kişinin veya nesnenin ayırt edici özelliklerinin kelimelerle resim çizer gibi anlatıldığı biçim hangisidir?",
    "explanation": "Göz önünde canlandırma ve niteleyici sözcüklerle resim çizme betimlemedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Öyküleme",
        "Betimleme (Tasvir)",
        "Tartışma",
        "Açıklama"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "LGS-TUR-M-010",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Fiilde Çatı (Geçişli - Geçişsiz)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Başına \"onu\" kelimesi getirilebilen ve nesne alabilen fiillere ne ad verilir?",
    "explanation": "Nesne alan veya nesne alabilen fiiller geçişli fiillerdir (Örn: Onu okudu).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Geçişli fiil",
        "Geçişsiz fiil",
        "Etken fiil",
        "Edilgen fiil"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-001",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Canlıların Ortak Özellikleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bütün canlı hücrelerde protein sentezinin gerçekleştiği zarsız organel aşağıdakilerden hangisidir?",
    "explanation": "Ribozom hem prokaryot hem ökaryot tüm canlı hücrelerde bulunan evrensel zarsız organeldir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mitokondri",
        "Ribozom",
        "Golgi cisimciği",
        "Lizozom"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-002",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "İnorganik ve Organik Bileşikler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "İnsan vücudunda temel enerji kaynağı olarak ilk sırada kullanılan organik besin grubu hangisidir?",
    "explanation": "Hücresel solunumda yıkımı en kolay olduğu için karbonhidratlar 1. sırada enerji verici olarak kullanılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Proteinler",
        "Yağlar",
        "Karbonhidratlar",
        "Vitaminler"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-003",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Organelleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Ökaryot hücrelerde oksijenli solunum yaparak ATP üreten çift zarlı organel hangisidir?",
    "explanation": "Mitokondri hücrenin enerji santralidir ve oksijenli solunumla ATP sentezler.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sentrozom",
        "Mitokondri",
        "Koful",
        "Endoplazmik retikulum"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-004",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Bölünmeleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Vücut (soma) hücrelerinde görülen ve kalıtsal çeşitlilik sağlamayan hücre bölünmesi çeşidi hangisidir?",
    "explanation": "Mitoz bölünmede kromozom sayısı ve genetik yapı korunur; 2 özdeş hücre oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mayoz",
        "Mitoz",
        "Döllenme",
        "Konjugasyon"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-005",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Canlıların Sınıflandırılması",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bakteriler ve arkeler hücre yapısına göre hangi canlı grubuna dahildir?",
    "explanation": "Bakteri ve arkelerin zarlı çekirdeği ve zarlı organelleri yoktur; prokaryot hücre yapısına sahiptir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ökaryot",
        "Prokaryot",
        "Çok hücreli",
        "Omurgalı"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-006",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Ekosistem Ekolojisi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Besin zincirinin ilk basamağında (üretici basamağında) aşağıdaki canlılardan hangisi yer alır?",
    "explanation": "Fotosentez veya kemosentez yapan ototrof (üretici) canlılar besin piramidinin en alt basamağındadır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Otçul hayvanlar",
        "Yeşil bitkiler ve algler",
        "Ayrıştırıcı mantarlar",
        "Etçil hayvanlar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-007",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Nükleik Asitler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "DNA molekülünde Adenin (A) organik bazının karşısına daima hangi baz gelir?",
    "explanation": "DNA çift sarmalında Adenin ile Timin ikili, Guanin ile Sitozin üçlü zayıf hidrojen bağı kurar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Urasil (U)",
        "Sitozin (C)",
        "Guanin (G)",
        "Timin (T)"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-008",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Enzimler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Biyolojik katalizör olan bileşik enzimlerin protein kısmına ne ad verilir?",
    "explanation": "Bileşik (holo) enzimlerin protein kısmına apoenzim, yardımcı kısmına koenzim veya kofaktör denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Apoenzim",
        "Koenzim",
        "Kofaktör",
        "Substrat"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-009",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Zarı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Akıcı-mozaik zar modeline göre hücre zarının temel çatısını oluşturan çift katlı molekül hangisidir?",
    "explanation": "Hücre zarının temel yapısını çift sıralı fosfolipit tabakası ve aralarına gömülü proteinler oluşturur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Selüloz",
        "Fosfolipit",
        "Nişasta",
        "Glikojen"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-E-010",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Kalıtım",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir karakter bakımından homozigot baskın (AA) ile homozigot çekinik (aa) iki bireyin çaprazlanmasından oluşan F₁ dölünün genotipi nedir?",
    "explanation": "AA × aa çaprazlamasından oluşan tüm bireyler %100 heterozigot baskın (Aa) olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "%100 AA",
        "%100 Aa",
        "%50 AA, %50 aa",
        "%100 aa"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-001",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Eşeye Bağlı Kalıtım",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Renk körlüğü taşıyıcısı bir anne (XᴿXʳ) ile sağlıklı bir babanın (XᴿY) doğacak bir çocuğunun renk körü erkek (XʳY) olma olasılığı kaçtır?",
    "explanation": "Olası genotipler: XᴿXᴿ, XᴿXʳ, XᴿY, XʳY. Renk körü erkek (XʳY) olma olasılığı 1/4 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1/2",
        "1/4",
        "1/8",
        "3/4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-002",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Dihibrit Çaprazlama",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bağımsız genlere sahip AaBb genotipli bir birey kendiyle çaprazlandığında (AaBb × AaBb) çekinik fenotipli (aabb) birey oluşma olasılığı kaçtır?",
    "explanation": "aa olasılığı 1/4, bb olasılığı 1/4 olduğundan aabb olma olasılığı (1/4) · (1/4) = 1/16 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1/4",
        "1/8",
        "1/16",
        "3/16"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-003",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Bölünmesi Hesaplamaları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "2n = 24 kromozomlu bir hayvan hücresi art arda 3 mitoz ve ardından 1 mayoz bölünme geçirirse oluşacak hücre sayısı ve kromozom sayısı kaç olur?",
    "explanation": "3 mitoz sonunda 2³ = 8 hücre oluşur. Her biri mayoz geçirince 8 · 4 = 32 hücre oluşur ve kromozom sayısı yarıya inerek n = 12 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "16 hücre, n = 12",
        "32 hücre, n = 12",
        "32 hücre, 2n = 24",
        "8 hücre, n = 12"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-004",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Turgor ve Osmotik Basınç",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Hipertonik (çok yoğun) tuzlu su ortamına bırakılan bir bitki hücresinin su kaybederek büzülmesi olayına ne ad verilir?",
    "explanation": "Hipertonik ortamda su kaybeden hücrenin büzülmesine plazmoliz denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Deplazmoliz",
        "Plazmoliz",
        "Hemoliz",
        "Turgor"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-005",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Besin Piramidi ve Enerji Akışı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir besin piramidinde üretici basamağında 10000 J biyokütle enerjisi varsa, %10 yasasına göre üçüncül tüketiciye kaç Joule enerji aktarılır?",
    "explanation": "Üretici (10000) → 1. tüketici (1000) → 2. tüketici (100) → 3. tüketici (10 J) enerji aktarılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1000",
        "100",
        "10",
        "1"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-006",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Trigliserit Sentezi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "10 molekül nötral yağ (trigliserit) sentezi sırasında kaç molekül yağ asidi kullanılır ve kaç molekül su açığa çıkar?",
    "explanation": "1 trigliserit için 1 gliserol + 3 yağ asidi → 1 trigliserit + 3 H₂O. 10 molekül için 30 yağ asidi ve 30 H₂O oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10 yağ asidi, 10 su",
        "30 yağ asidi, 30 su",
        "30 yağ asidi, 10 su",
        "20 yağ asidi, 30 su"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-007",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Plastikler ve Lökoplast-Kloroplast",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bitkilerde renksiz olan ve nişasta depolayan lökoplastlar uzun süre güneş ışığına maruz kaldığında hangi organele dönüşebilir?",
    "explanation": "Plastitler birbirine dönüşebilir; ışık varlığında lökoplastlar kloroplasta dönüşebilir (örneğin patatesin yeşermesi).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Mitokondri",
        "Kloroplast",
        "Peroksizom",
        "Sentrozom"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-008",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Virüslerin Özellikleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Zorunlu hücre içi parazit olan virüslerle ilgili aşağıdakilerden hangisi yanlıştır?",
    "explanation": "Antibiyotikler bakterilere etki eder; virüslerin metabolizması ve hücre zarı olmadığı için antibiyotiklerden etkilenmezler.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kristalleşebilirler",
        "Antibiyotiklerden etkilenirler",
        "Sadece DNA veya sadece RNA taşırlar",
        "Enzim sistemleri olmadığından ATP üretemezler"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-009",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Soyağacı Analizi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Y kromozomunun X ile homolog olmayan bölgesinde taşınan bir özellik için aşağıdakilerden hangisi kesinlikle doğrudur?",
    "explanation": "Y kromozomu babadan yalnızca erkek çocuklara aktarılır; dişilerde Y kromozomu bulunmaz.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Anneden erkek çocuğa geçer",
        "Yalnızca erkek bireylerde görülür ve babadan tüm erkek çocuklara geçer",
        "Kız çocuklarda çekinik taşınır",
        "Sadece homozigot durumda etkisini gösterir"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-H-010",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Sera Etkisi ve Küresel Isınma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Göllerde azot ve fosforlu atıkların aşırı artması sonucu alglerin kontrolsüz çoğalarak suyun alt katmanlarında oksijenin tükenmesine ne ad verilir?",
    "explanation": "Su kaynaklarında besin tuzu artışıyla alg patlaması yaşanması olayına ötrofikasyon denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Erozyon",
        "Ötrofikasyon",
        "Biyolojik birikim",
        "Süksesyon"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-001",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Madde Geçişleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Suyun yarı geçirgen zardan çok yoğun olduğu ortamdan az yoğun olduğu ortama ATP harcanmadan geçişine ne ad verilir?",
    "explanation": "Suyun seçici geçirgen zardan difüzyonuna osmoz denir ve pasif bir olaydır (ATP harcanmaz).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Aktif taşıma",
        "Osmoz",
        "Endositoz",
        "Ekzositoz"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-002",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Polisakkaritler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Böceklerin dış iskeletinde ve mantarların hücre duvarında bulunan azotlu yapısal polisakkarit hangisidir?",
    "explanation": "Kitin yapısında azot (N) bulunduran yapısal bir polisakkarittir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Selüloz",
        "Kitin",
        "Nişasta",
        "Glikojen"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-003",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Mayoz Bölünme",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Mayoz bölünmede homolog kromozomlar arasında parça değişimi (krossing-over) hangi evrede gerçekleşir?",
    "explanation": "Tetrat, sinapsis ve krossing-over olayları Mayoz I evresinin Profaz I aşamasında gerçekleşir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Profaz I",
        "Metafaz I",
        "Anafaz I",
        "Profaz II"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-004",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Kan Grupları Kalıtımı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Anne A0, baba B0 genotipli olduğunda doğacak çocukların 0 (sıfır) kan gruplu olma olasılığı kaçtır?",
    "explanation": "A0 × B0 çaprazlamasında AB, A0, B0, 00 genotipleri eşit (1/4) olasılıkla oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1/2",
        "1/4",
        "1/8",
        "3/4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-005",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Organeller ve Görevleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Hücre içi sindirim enzimlerini taşıyan ve yaşlanmış organellerin parçalanmasını (otofaji) sağlayan organel hangisidir?",
    "explanation": "Lizozom hidrolitik sindirim enzimleri içerir ve hücre içi sindirimden sorumludur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Peroksizom",
        "Lizozom",
        "Golgi cisimciği",
        "Sentrozom"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-006",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Omurgalılar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Olgunlaşmış alyuvarları çekirdeksiz olan, akciğerlerinde alveol bulunan ve yavrularını sütle besleyen omurgalı sınıfı hangisidir?",
    "explanation": "Alveollü akciğer, çekirdeksiz olgun alyuvar ve süt bezleri yalnızca memelilere özgüdür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kuşlar",
        "Memeliler",
        "Sürüngenler",
        "İki yaşamlılar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-007",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Azot Döngüsü",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Topraktaki amonyağın (NH₃) kemosentetik bakteriler tarafından bitkinin kullanabileceği nitrat (NO₃⁻) tuzlarına dönüştürülmesi olayına ne ad verilir?",
    "explanation": "Nitrit ve nitrat bakterilerinin amonyağı nitrata yükseltgemesine nitrifikasyon denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Denitrifikasyon",
        "Nitrifikasyon",
        "Çürüme (Pütrifikasyon)",
        "Ötrofikasyon"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-008",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Enzim Aktivitesi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yüksek sıcaklıkta (örneğin 60 °C üzerinde) enzimlerin üç boyutlu protein yapısının geri dönüşümsüz olarak bozulmasına ne ad verilir?",
    "explanation": "Yüksek sıcaklık proteinlerin üç boyutlu yapısını bozar; bu olaya denatürasyon denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İnhibisyon",
        "Denatürasyon",
        "Aktivasyon",
        "Hidroliz"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-009",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Eşeysiz Üreme",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bira mayasında ana canlının vücudunda oluşan çıkıntının gelişerek yeni birey oluşturması hangi eşeysiz üreme çeşididir?",
    "explanation": "Bira mayası ve hidra gibi canlılar tomurcuklanma ile eşeysiz ürer.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Bölünerek üreme",
        "Tomurcuklanma",
        "Sporla üreme",
        "Rejenerasyon"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-BIY-M-010",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Vitaminler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki vitaminlerden hangisi yağda çözünen ve karaciğerde depolanabilen vitaminlerden biri değildir?",
    "explanation": "A, D, E, K vitaminleri yağda çözünür; B ve C vitaminleri suda çözünür ve fazlası depolanmaz.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "A vitamini",
        "C vitamini",
        "D vitamini",
        "K vitamini"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-001",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Fizik Bilimine Giriş",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdakilerden hangisi SI birim sisteminde temel bir büyüklüktür?",
    "explanation": "Kütle (kg) KISAMUZ kodlamasındaki 7 temel büyüklükten biridir; diğerleri türetilmiş büyüklüktür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kuvvet",
        "Hız",
        "Kütle",
        "Enerji"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-002",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Madde ve Özellikleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Kütlesi 120 g, hacmi 40 cm³ olan türdeş bir maddenin özkütlesi kaç g/cm³'tür?",
    "explanation": "d = m / V = 120 / 40 = 3 g/cm³ bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-003",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Isı ve Sıcaklık",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Saf suyun deniz seviyesinde donma sıcaklığı Kelvin ölçeğinde kaç K değerine karşılık gelir?",
    "explanation": "0 °C donma noktası Kelvin ölçeğinde 0 + 273 = 273 K değerine eşittir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0",
        "100",
        "273",
        "373"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-004",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Kuvvet ve Hareket",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Sürtünmesiz yatay düzlemde duran 4 kg kütleli cisme 20 N yatay kuvvet uygulanırsa ivmesi kaç m/s² olur?",
    "explanation": "F = m · a ⇒ 20 = 4 · a ⇒ a = 5 m/s² olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "5",
        "6",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-005",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "İş Güç Enerji",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Yatay sürtünmesiz yolda 15 N kuvvetle 6 m çekilen cisim üzerinde yapılan iş kaç Joule olur?",
    "explanation": "W = F · Δx = 15 · 6 = 90 Joule bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "60",
        "75",
        "90",
        "105"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-006",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Elektrik Akımı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Direnci 6 Ω olan bir iletkenden 3 A akım geçtiğine göre uçları arasındaki potansiyel fark kaç Volt olur?",
    "explanation": "Ohm Yasası: V = I · R = 3 · 6 = 18 Volt olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "9",
        "12",
        "18",
        "24"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-007",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Optik - Aydınlanma",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Işık şiddeti birimi aşağıdakilerden hangisidir?",
    "explanation": "SI birim sisteminde ışık şiddeti birimi Candela (cd) olarak tanımlanır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Lümen",
        "Lüks",
        "Candela",
        "Watt"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-008",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Manyetizma",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir çubuk mıknatıs ortadan ikiye bölündüğünde oluşan parçaların kutup durumu nasıl olur?",
    "explanation": "Mıknatıslar ne kadar bölünürse bölünsün tek kutup (monopol) elde edilemez; her parça N-S kutuplu olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tek kutuplu iki mıknatıs oluşur",
        "Mıknatıslık özelliği kaybolur",
        "Her parça yine N ve S kutuplu tam birer mıknatıs olur",
        "Sadece N kutbu kalır"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-009",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Ses Dalgaları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Sesin yüksekliği (ince veya kalın duyulması) ses dalgasının hangi fiziksel özelliğine bağlıdır?",
    "explanation": "Fizikte sesin yüksekliği frekansa bağlıdır; frekans arttıkça ses incelir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Genlik",
        "Frekans",
        "Yayılma hızı",
        "Şiddet"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-E-010",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Elektrostatik",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Nötr bir cisim dışarıdan elektron alırsa elektrik yükü nasıl değişir?",
    "explanation": "Elektron negatif yüklü olduğundan elektron alan nötr cisim negatif (-) yükle yüklenir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Pozitif (+) yüklenir",
        "Negatif (-) yüklenir",
        "Nötr kalır",
        "Proton sayısı artar"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-001",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Optik - Kırılma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Kırıcılık indisi n₁ = 2 olan ortamdan n₂ = 1 olan ortama geçen ışın için sınır açısı kaç derecedir?",
    "explanation": "sin(θs) = n₂ / n₁ = 1 / 2 ⇒ θs = 30° bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "37",
        "45",
        "60"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-002",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Sürtünmeli Hareket",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Yatay düzlemde 5 kg kütleli cisme 30 N yatay kuvvet uygulanıyor. Sürtünme katsayısı k = 0.2 olduğuna göre cismin ivmesi kaç m/s²'dir? (g = 10 m/s²)",
    "explanation": "fs = k·m·g = 0.2·5·10 = 10 N. Fnet = 30 - 10 = 20 N ⇒ a = 20 / 5 = 4 m/s² olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-003",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Isı Alışverişi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "20 °C'deki 100 g su ile 80 °C'deki 300 g su karıştırılırsa denge sıcaklığı kaç °C olur?",
    "explanation": "Tdenge = (100·20 + 300·80) / (100 + 300) = 26000 / 400 = 65 °C bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "50",
        "60",
        "65",
        "70"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-004",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Elektriksel Güç",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "İç direnci önemsiz 24 V üretece bağlı 8 Ω dirençte 10 saniyede açığa çıkan ısı enerjisi kaç Joule olur?",
    "explanation": "E = (V² / R) · t = (576 / 8) · 10 = 72 · 10 = 720 Joule bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "360",
        "480",
        "720",
        "960"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-005",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Küresel Aynalar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Odak uzaklığı f = 12 cm olan çukur aynanın önüne 24 cm uzağa konulan cismin görüntüsü aynadan kaç cm uzakta oluşur?",
    "explanation": "24 cm = 2f (merkez) noktasıdır. Merkezdeki cismin görüntüsü yine merkezde (24 cm uzakta) oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12",
        "18",
        "24",
        "36"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-006",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Basınç ve Kaldırma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Özkütlesi 0.6 g/cm³ olan katı bir cisim su (d = 1 g/cm³) içinde yüzerken hacminin yüzde kaçı suyun dışında kalır?",
    "explanation": "Batan hacim oranı dcisim / dsu = 0.6 / 1 = %60 olduğundan %40 kısmı suyun dışında kalır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "20",
        "30",
        "40",
        "60"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-007",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Mercekler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Odak uzaklığı 15 cm olan ince kenarlı (yakınsak) merceğin asal ekseni üzerinde mercekten 30 cm uzağa konulan cismin görüntüsü mercekten kaç cm uzakta oluşur?",
    "explanation": "2f (30 cm) noktasındaki cismin gerçek görüntüsü diğer tarafta 2f (30 cm) uzaklıkta oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "15",
        "20",
        "30",
        "45"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-008",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Hal Değişimi ve Isı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Erime sıcaklığındaki 50 g buzu tamamen eritmek için kaç kalori ısı gerekir? (L_erime = 80 cal/g)",
    "explanation": "Q = m · L = 50 · 80 = 4000 kalori ısı gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2000",
        "3000",
        "4000",
        "5000"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-009",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Yay Dalgaları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "İnce yaydan kalın yaya gönderilen baş yukarı bir atmanın iletilen ve yansıyan atmalarının durumu aşağıdakilerden hangisidir?",
    "explanation": "İnce yaydan kalın yaya geçiş sabit uç gibi davranır: iletilen daima gelenle aynı (baş yukarı), yansıyan ters döner (baş aşağı).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İletilen baş yukarı, yansıyan baş aşağı",
        "İletilen baş aşağı, yansıyan baş yukarı",
        "İkisi de baş yukarı",
        "İkisi de baş aşağı"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-H-010",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Açık Hava Basıncı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Torricelli deneyinde cıva (d = 13.6 g/cm³) yerine daha küçük özkütleli bir sıvı kullanılsaydı cam borudaki sıvı yüksekliği nasıl değişirdi?",
    "explanation": "P₀ = h · d · g bağıntısına göre P₀ sabitken sıvı özkütlesi d azalırsa yükseklik h artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Azalırdı",
        "Artardı",
        "Değişmezdi",
        "Sıfır olurdu"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-001",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Doğrusal Hareket",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Durgun halden harekete geçen bir araç 4 m/s² sabit ivme ile 5 saniye boyunca hızlanıyor. Bu süre sonunda aracın aldığı toplam yol kaç metredir?",
    "explanation": "x = (1/2) · a · t² = 0.5 · 4 · 25 = 50 metre yol alır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "20",
        "40",
        "50",
        "100"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-002",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Basınç",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Özkütlesi 2 g/cm³ olan sıvının 5 m derinliğinde oluşturduğu sıvı basıncı kaç kPa olur? (g = 10 m/s²)",
    "explanation": "d = 2000 kg/m³. P = h · d · g = 5 · 2000 · 10 = 100000 Pa = 100 kPa bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "50",
        "80",
        "100",
        "120"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-003",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Kaldırma Kuvveti",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Hacmi 400 cm³ olan bir cisim özkütlesi 1 g/cm³ olan suya tamamen daldırıldığında cisme etki eden kaldırma kuvveti kaç N olur? (g = 10 m/s²)",
    "explanation": "V = 0.0004 m³, d = 1000 kg/m³. Fk = Vb · ds · g = 0.0004 · 1000 · 10 = 4 N olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "4",
        "6",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-004",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Enerji Korunumu",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yerden 20 m yükseklikten serbest bırakılan bir cisim yere kaç m/s hızla çarpar? (g = 10 m/s², sürtünmeler önemsiz)",
    "explanation": "m·g·h = (1/2)m·v² ⇒ v = √(2gh) = √(2 · 10 · 20) = 20 m/s bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10",
        "15",
        "20",
        "25"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-005",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Elektrik Devreleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Birbirine paralel bağlı 6 Ω ve 3 Ω'luk iki direncin eşdeğer direnci kaç Ω'dur?",
    "explanation": "Eşdeğer Direnç = (6 · 3) / (6 + 3) = 18 / 9 = 2 Ω bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "9"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-006",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Dalgalar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yayılma hızı 20 m/s ve frekansı 4 Hz olan periyodik bir dalganın dalga boyu kaç metredir?",
    "explanation": "v = λ · f ⇒ 20 = λ · 4 ⇒ λ = 5 metre olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "5",
        "8",
        "10"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-007",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Güç Kavramı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "600 Joule işi 12 saniyede yapan bir motorun mekanik gücü kaç Watt olur?",
    "explanation": "P = W / t = 600 / 12 = 50 Watt bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "40",
        "50",
        "60"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-008",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Düzlem Ayna",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Düzlem aynaya 1.5 m uzaklıkta duran bir gözlemcinin aynadaki görüntüsü ile kendisi arasındaki uzaklık kaç metredir?",
    "explanation": "Düzlem aynada cisim ve görüntü aynaya eşit uzaklıktadır: 1.5 + 1.5 = 3.0 metre olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1.5",
        "2.0",
        "3.0",
        "4.5"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-009",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Adezyon ve Kohezyon",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Yağmur damlalarının küresel şekil almasını sağlayan temel kuvvet aşağıdakilerden hangisidir?",
    "explanation": "Aynı cins su moleküllerinin birbirini çekmesi (kohezyon) damlanın küresel kalmasını sağlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Adezyon (Yapışma)",
        "Kohezyon (Tutunma)",
        "Sürtünme kuvveti",
        "Arşimet kuvveti"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-FIZ-M-010",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Katı Basıncı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Ağırlığı 60 N ve taban alanı 0.03 m² olan dik prizmanın yatay zemine uyguladığı basınç kaç Pa olur?",
    "explanation": "P = G / S = 60 / 0.03 = 2000 Pa bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1000",
        "1500",
        "2000",
        "3000"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-001",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kimya Bilimi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Periyodik tabloda Na sembolü ile gösterilen element aşağıdakilerden hangisidir?",
    "explanation": "Na sembolü Sodyum (Natrium) elementine aittir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Azot",
        "Sodyum",
        "Potasyum",
        "Nikel"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-002",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Atom ve Periyodik Sistem",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Proton sayısı 17, nötron sayısı 18 olan klor atomunun kütle numarası kaçtır?",
    "explanation": "Kütle numarası = Proton + Nötron = 17 + 18 = 35 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "17",
        "18",
        "34",
        "35"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-003",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Maddenin Halleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Maddenin katı halden doğrudan gaz haline geçmesi olayına ne ad verilir?",
    "explanation": "Katı halden sıvılaşmadan doğrudan gaz haline geçişe süblimleşme denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Erime",
        "Kırağılaşma",
        "Süblimleşme",
        "Yoğuşma"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-004",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Asitler ve Bazlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Oda koşullarında sulu çözeltisinin pH değeri 7'den küçük olan maddeler için aşağıdakilerden hangisi doğrudur?",
    "explanation": "25 °C sıcaklıkta pH < 7 olan çözeltiler asidiktir ve mavi turnusol kağıdını kırmızıya çevirir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Baziktir",
        "Asidiktir",
        "Nötrdür",
        "Mavi turnusolu değiştirmez"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-005",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kimyasal Türler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "H₂O molekülünde hidrojen ve oksijen atomları arasındaki güçlü etkileşim türü hangisidir?",
    "explanation": "Farklı ametal atomları (H ve O) arasında elektron ortaklaşmasıyla polar kovalent bağ oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İyonik bağ",
        "Polar kovalent bağ",
        "Apolar kovalent bağ",
        "Metalik bağ"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-006",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Karışımlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdakilerden hangisi homojen bir karışıma (çözeltiye) örnektir?",
    "explanation": "Tuzlu su her yerinde aynı özelliği gösteren homojen bir karışımdır (çözeltidir).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ayran",
        "Sis",
        "Tuzlu su",
        "Zeytinyağlı su"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-007",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kimya Güvenlik Sembolleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Üzerinde kuru kafa ve çapraz kemik piktogramı bulunan kimyasal madde şişesi hangi tehlikeyi ifade eder?",
    "explanation": "Kuru kafa piktogramı maddenin toksik (zehirli) olduğunu gösterir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yanıcı madde",
        "Toksik (Zehirli) madde",
        "Radyoaktif madde",
        "Yakıcı madde"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-008",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Doğa ve Kimya",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Suda kalsiyum (Ca²⁺) ve magnezyum (Mg²⁺) iyonlarının fazla miktarda bulunması suyun hangi özelliğini artırır?",
    "explanation": "Ca²⁺ ve Mg²⁺ iyonları derişimi yüksek olan sulara sert su denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yumuşaklığını",
        "Sertliğini",
        "Asitliğini",
        "Uçuculuğunu"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-009",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kimyasal Değişimler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki olaylardan hangisi kimyasal bir değişime örnektir?",
    "explanation": "Demirin paslanması oksijenle gerçekleşen bir yanma (oksitlenme) tepkimesidir ve kimyasaldır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Buzun erimesi",
        "Camın kırılması",
        "Demirin paslanması",
        "Şekerin suda çözünmesi"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-E-010",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Bileşikler ve Yaygın Adları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Formülü CaCO₃ olan bileşiğin yaygın adı aşağıdakilerden hangisidir?",
    "explanation": "CaCO₃ (Kalsiyum karbonat) yaygın olarak kireç taşı olarak bilinir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sönmemiş kireç",
        "Kireç taşı",
        "Yemek sodası",
        "Sud kostik"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-001",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Sınırlayıcı Bileşen",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "4 mol N₂ ve 6 mol H₂ gazları N₂ + 3H₂ → 2NH₃ denklemine göre tam verimle tepkimeye girdiğinde kaç mol NH₃ oluşur?",
    "explanation": "H₂ sınırlayıcı bileşendir: 6 mol H₂ tamamen harcanırken 2 mol N₂ harcanır ve 4 mol NH₃ oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2",
        "3",
        "4",
        "6"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-002",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Koligatif Özellikler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Uçucu olmayan bir katının saf suda çözünmesiyle oluşan çözeltinin 1 atm basınçta kaynamaya başlama sıcaklığı ve donmaya başlama sıcaklığı saf suya göre nasıl değişir?",
    "explanation": "Uçucu olmayan katı çözündüğünde kaynama noktası yükselir (ebüliyoskopi), donma noktası düşer (kriyoskopi).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Yükselir - Düşer",
        "Düşer - Yükselir",
        "Yükselir - Yükselir",
        "Düşer - Düşer"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-003",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Sabit Oranlar Yasası",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Fe₂O₃ bileşiğinde kütlece birleşme oranı m(Fe) / m(O) = 7/3 olduğuna göre 21 g Fe ile yeterince oksijenin tepkimesinden kaç gram Fe₂O₃ oluşur?",
    "explanation": "7 g Fe ile 3 g O birleşip 10 g bileşik oluşturuyorsa, 3 katı olan 21 g Fe ile 9 g O birleşir ve 30 g Fe₂O₃ oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "24",
        "27",
        "30",
        "35"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-004",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Asit Baz Tepkimeleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "2 mol H₂SO₄ içeren sulu çözeltiyi tam nötralleştirmek için kaç mol NaOH gerekir?",
    "explanation": "2 mol H₂SO₄ ortama 4 mol H⁺ verir; tam nötralleşme için 4 mol OH⁻ yani 4 mol NaOH gerekir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-005",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "İzotop Atomlar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Doğada ³⁵Cl izotopu %75, ³⁷Cl izotopu %25 oranında bulunduğuna göre klorun ortalama atom kütlesi kaç akb'dir?",
    "explanation": "Ortalama atom kütlesi = 35 · 0.75 + 37 · 0.25 = 26.25 + 9.25 = 35.5 akb olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "35.2",
        "35.5",
        "36.0",
        "36.5"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-006",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Yüzde Verim",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "CaCO₃(k) → CaO(k) + CO₂(g) tepkimesine göre 200 g CaCO₃ %50 verimle ayrıştığında kaç mol CO₂ oluşur? (CaCO₃ = 100 g/mol)",
    "explanation": "200 g CaCO₃ = 2 mol. %50 verimle 1 mol CaCO₃ ayrışır ve 1 mol CO₂ oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "0.5",
        "1",
        "1.5",
        "2"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-007",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Katlı Oranlar Yasası",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "X₂Y₃ ve XYₙ bileşiklerinde aynı miktar X ile birleşen birinci bileşikteki Y kütlesinin ikinci bileşikteki Y kütlesine oranı 3/4 olduğuna göre n kaçtır?",
    "explanation": "X sayılarını eşitlersek X₂Y₃ ve X₂Y₂ₙ olur. 3 / (2n) = 3 / 4 ⇒ 2n = 4 ⇒ n = 2 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-008",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Metal - Asit Tepkimeleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Yarı soy bir metal olan bakır (Cu), aşağıdaki asitlerden hangisinin derişik sulu çözeltisiyle tepkimeye girerek SO₂ gazı açığa çıkarır?",
    "explanation": "Yarı soy metaller (Cu, Hg, Ag) oksijensiz asitlerle tepkime vermez; derişik H₂SO₄ ile SO₂ gazı açığa çıkarır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "HCl",
        "H₂SO₄",
        "CH₃COOH",
        "HF"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-009",
    "examType": "TYT",
    "subject": "kimya",
    "topic": " İyonlaşma Enerjisi Tablosu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Baş grup elementi olan X atomunun ilk dört iyonlaşma enerjisi sırasıyla 176, 348, 1847 ve 2520 kJ/mol olduğuna göre X hangi grupta yer alır?",
    "explanation": "İkinci ve üçüncü iyonlaşma enerjileri arasında yaklaşık 5.3 katlık sıçrama olduğundan değerlik elektron sayısı 2 (2A grubu) olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1A",
        "2A",
        "3A",
        "4A"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-H-010",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Sıvıların Buhar Basıncı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Ağzı açık bir kapta kaynamakta olan saf suyun buhar basıncı aşağıdakilerden hangisine eşittir?",
    "explanation": "Kaynama anında sıvının buhar basıncı bulunduğu ortamdaki dış (açık hava) basıncına eşittir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Dış (Açık hava) basıncına",
        "Sıfıra",
        "Sıvı kütlesine",
        "Kabın hacmine"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-001",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Periyodik Özellikler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Periyodik sistemde aynı periyotta soldan sağa doğru gidildikçe atom yarıçapı ve birinci iyonlaşma enerjisi genel olarak nasıl değişir?",
    "explanation": "Soldan sağa çekirdek çekim gücü arttığından atom yarıçapı azalır, iyonlaşma enerjisi genel olarak artar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Artar - Artar",
        "Azalır - Artar",
        "Azalır - Azalır",
        "Artar - Azalır"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-002",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Mol Kavramı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Normal koşullarda (NK) 11.2 litre hacim kaplayan CH₄ gazı kaç gramdır? (C=12, H=1)",
    "explanation": "n = 11.2 / 22.4 = 0.5 mol. CH₄ mol kütlesi 16 g/mol olduğundan m = 0.5 · 16 = 8 gramdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "8",
        "12",
        "16"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-003",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kimyasal Hesaplamalar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "0.5 mol C₃H₈ gazı tamamen yakıldığında kaç mol CO₂ gazı oluşur?",
    "explanation": "1 mol C₃H₈ yandığında 3 mol CO₂ oluşur; 0.5 mol yandığında 0.5 · 3 = 1.5 mol CO₂ oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "1.5",
        "2",
        "3"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-004",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Çözelti Derişimleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "160 g suda 40 g şeker çözünerek hazırlanan çözeltinin kütlece yüzde derişimi kaçtır?",
    "explanation": "Toplam çözelti = 160 + 40 = 200 g. Kütlece % = (40 / 200) · 100 = %20 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "15",
        "20",
        "25",
        "30"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-005",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Zayıf Etkileşimler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki moleküllerden hangisinin yoğun fazlarında moleküller arasında hidrojen bağı görülür?",
    "explanation": "Hidrojenin F, O, N atomlarından birine bağlı olduğu NH₃ moleküllerinde hidrojen bağı bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "CH₄",
        "HCl",
        "NH₃",
        "CO₂"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-006",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Atomun Yapısı",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "²⁴₁₂Mg²⁺ iyonunun elektron sayısı kaçtır?",
    "explanation": "Proton sayısı 12, yükü +2 olduğundan elektron sayısı 12 - 2 = 10 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10",
        "12",
        "14",
        "24"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-007",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Ayırma Yöntemleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kaynama noktaları birbirinden farklı olan alkol-su homojen sıvı karışımını bileşenlerine ayırmak için kullanılan en uygun yöntem hangisidir?",
    "explanation": "Sıvı-sıvı homojen karışımlar kaynama noktası farkından yararlanılarak ayrımsal damıtma ile ayrılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ayırma hunisi",
        "Ayrımsal damıtma",
        "Süzme",
        "Mıknatısla ayırma"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-008",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kütlenin Korunumu Yasası",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Kapalı bir kapta 12 g karbon (C) ile 32 g oksijen (O₂) artansız birleştiğinde kaç gram CO₂ gazı oluşur?",
    "explanation": "Lavoisier Kütlenin Korunumu Yasasına göre 12 + 32 = 44 gram CO₂ oluşur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "20",
        "32",
        "44",
        "56"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-009",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Katı Türleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Elmas ve grafit aşağıdaki katı türlerinden hangisine örnektir?",
    "explanation": "Elmas ve grafit karbon atomlarının kovalent bağlarla oluşturduğu ağ örgülü kovalent katılardır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İyonik katı",
        "Moleküler katı",
        "Kovalent (Ağ örgülü) katı",
        "Metalik katı"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-KIM-M-010",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Sabun ve Deterjanlar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Sabun molekülünün suyu seven (polar) baş kısmına ne ad verilir?",
    "explanation": "Suyu seven polar kısma hidrofil, suyu sevmeyen apolar kuyruk kısmına hidrofob denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Hidrofob kısım",
        "Hidrofil kısım",
        "Apolar kuyruk",
        "Hidrokarbon zinciri"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-001",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Birinci Dereceden Denklemler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "3x - 7 = 14 olduğuna göre x kaçtır?",
    "explanation": "3x = 21 ⇒ x = 7 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "6",
        "7",
        "8"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-002",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Temel Kavramlar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Ardışık üç çift tam sayının toplamı 42 olduğuna göre, bu sayıların en büyüğü kaçtır?",
    "explanation": "Ortanca sayı 42 / 3 = 14 olur. Sayılar 12, 14, 16 olduğundan en büyüğü 16 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12",
        "14",
        "16",
        "18"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-003",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Rasyonel Sayılar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "3/4 + 5/8 işleminin sonucu kaçtır?",
    "explanation": "Payda eşitlenirse 6/8 + 5/8 = 11/8 elde edilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "7/8",
        "9/8",
        "11/8",
        "13/8"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-004",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Üslü Sayılar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "2⁵ + 2⁵ işleminin sonucu aşağıdakilerden hangisine eşittir?",
    "explanation": "2 · 2⁵ = 2⁶ bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2⁶",
        "2¹⁰",
        "4⁵",
        "2⁷"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-005",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Oran Orantı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "a/b = 3/5 ve a + b = 40 olduğuna göre b - a kaçtır?",
    "explanation": "3k + 5k = 40 ⇒ 8k = 40 ⇒ k = 5. b - a = 2k = 10 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "8",
        "10",
        "12",
        "15"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-006",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Yüzde Problemleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "240 sayısının %25'i kaçtır?",
    "explanation": "240 · (25 / 100) = 240 / 4 = 60 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "45",
        "50",
        "60",
        "75"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-007",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Sayı Basamakları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Rakamları birbirinden farklı üç basamaklı en küçük doğal sayı ile iki basamaklı en büyük doğal sayının toplamı kaçtır?",
    "explanation": "Rakamları farklı üç basamaklı en küçük doğal sayı 102, iki basamaklı en büyük doğal sayı 99 olup toplamları 102 + 99 = 201 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "199",
        "200",
        "201",
        "211"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-008",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Basit Eşitsizlikler",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "2x - 5 < 9 eşitsizliğini sağlayan en büyük x tam sayısı kaçtır?",
    "explanation": "2x < 14 ⇒ x < 7 olduğundan en büyük tam sayı 6 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "5",
        "6",
        "7",
        "8"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-009",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Sayı Problemleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Hangi sayının 4 katının 6 eksiği 30 eder?",
    "explanation": "4x - 6 = 30 ⇒ 4x = 36 ⇒ x = 9 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "7",
        "8",
        "9",
        "10"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-E-010",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Üçgende Açılar",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Bir üçgenin iç açıları 2, 3 ve 4 sayılarıyla doğru orantılı olduğuna göre en küçük iç açısı kaç derecedir?",
    "explanation": "2k + 3k + 4k = 180° ⇒ 9k = 180° ⇒ k = 20°. En küçük açı 2k = 40° olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "30",
        "40",
        "50",
        "60"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-001",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Permütasyon - Kombinasyon",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "6 doktor ve 4 hemşire arasından içinde en az 2 doktor bulunan 3 kişilik bir sağlık ekibi kaç farklı şekilde seçilebilir?",
    "explanation": "C(6,2)·C(4,1) + C(6,3)·C(4,0) = 15·4 + 20·1 = 60 + 20 = 80 farklı şekilde seçilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "60",
        "70",
        "80",
        "96"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-002",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Olasılık",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "İki zar aynı anda atıldığında üst yüze gelen sayıların toplamının 8 olma olasılığı kaçtır?",
    "explanation": "Toplamı 8 olan durumlar: (2,6), (3,5), (4,4), (5,3), (6,2) olmak üzere 5 tanedir. Olasılık 5/36 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1/9",
        "5/36",
        "1/6",
        "7/36"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-003",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Polinomlar",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "P(x) = x³ - ax² + 4x - 6 polinomunun (x - 2) ile bölümünden kalan 2 olduğuna göre a kaçtır?",
    "explanation": "P(2) = 2 ⇒ 8 - 4a + 8 - 6 = 2 ⇒ 10 - 4a = 2 ⇒ a = 2 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-004",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Çarpanlara Ayırma",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "x - y = 5 ve x · y = 6 olduğuna göre x² + y² ifadesinin değeri kaçtır?",
    "explanation": "x² + y² = (x - y)² + 2xy = 5² + 2(6) = 25 + 12 = 37 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "31",
        "35",
        "37",
        "41"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-005",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Bölünebilme Kuralları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Dört basamaklı 4a5b sayısı 15 ile tam bölünebildiğine göre a'nın alabileceği en büyük değer kaçtır?",
    "explanation": "15 ile bölünebilme için 3 ve 5 ile bölünmelidir. b = 0 veya b = 5 olur. b = 0 için 4 + a + 5 + 0 = 9 + a ⇒ a = 9 olabilir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6",
        "7",
        "8",
        "9"
      ],
      "correctIndex": 3,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-006",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Karışım Problemleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Tuz oranı %20 olan 40 litre tuzlu suya 10 litre saf tuz eklenirse yeni karışımın tuz oranı yüzde kaç olur?",
    "explanation": "Başlangıçta 40 · 0.20 = 8 L tuz vardır. 10 L tuz eklenince toplam tuz 18 L, toplam karışım 50 L olur: 18 / 50 = %36.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "32",
        "36",
        "40",
        "44"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-007",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "EBOB - EKOK",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Boyutları 24 cm ve 36 cm olan dikdörtgen şeklindeki bir karton, hiç parça artmayacak şekilde eş karelere bölünecektir. En az kaç kare elde edilir?",
    "explanation": "EBOB(24, 36) = 12 cm. Kare sayısı = (24 / 12) · (36 / 12) = 2 · 3 = 6 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "4",
        "6",
        "8",
        "12"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-008",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Fonksiyonlarda Bileşke",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "f(x) = 2x + 3 ve g(x) = x - 4 olduğuna göre (f ∘ g)(5) değeri kaçtır?",
    "explanation": "g(5) = 5 - 4 = 1 ve f(g(5)) = f(1) = 2(1) + 3 = 5 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "5",
        "7",
        "9"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-009",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Çokgenler ve Dörtgenler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir dış açısının ölçüsü 24° olan düzgün çokgenin kenar sayısı kaçtır?",
    "explanation": "Dış açılar toplamı 360° olduğundan kenar sayısı n = 360° / 24° = 15 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "12",
        "15",
        "18",
        "20"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-H-010",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Kâr - Zarar Problemleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "%20 zararla 160 TL fiyata satılan bir ürün, %30 kârla kaç TL fiyata satılır?",
    "explanation": "Maliyet · 0.80 = 160 ⇒ Maliyet = 200 TL. %30 kârlı satış fiyatı = 200 · 1.30 = 260 TL olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "220",
        "240",
        "260",
        "280"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-001",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Mutlak Değer",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "|2x - 6| = 10 denklemini sağlayan x değerlerinin çarpımı kaçtır?",
    "explanation": "2x - 6 = 10 ⇒ x = 8 ve 2x - 6 = -10 ⇒ x = -2. Çarpımları 8 · (-2) = -16 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "-16",
        "-12",
        "6",
        "16"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-002",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Köklü Sayılar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "√75 - √27 + √12 işleminin sonucu kaçtır?",
    "explanation": "5√3 - 3√3 + 2√3 = 4√3 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "2√3",
        "3√3",
        "4√3",
        "5√3"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-003",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Yaş Problemleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir babanın yaşı oğlunun yaşının 3 katıdır. 6 yıl sonra yaşları toplamı 60 olacağına göre oğul bugün kaç yaşındadır?",
    "explanation": "Bugünkü yaşları toplamı 60 - 12 = 48. x + 3x = 48 ⇒ 4x = 48 ⇒ x = 12 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "10",
        "12",
        "14",
        "15"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-004",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Kümeler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "s(A) = 12, s(B) = 9 ve s(A ∩ B) = 4 olduğuna göre s(A ∪ B) kaçtır?",
    "explanation": "s(A ∪ B) = s(A) + s(B) - s(A ∩ B) = 12 + 9 - 4 = 17 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "15",
        "17",
        "19",
        "21"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-005",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Fonksiyonlar",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "f(x) = 4x - 5 olduğuna göre f(3) + f⁻¹(7) toplamı kaçtır?",
    "explanation": "f(3) = 4(3) - 5 = 7. 4x - 5 = 7 ⇒ x = 3 olduğundan f⁻¹(7) = 3. Toplamları 7 + 3 = 10 olur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "8",
        "10",
        "12",
        "14"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-006",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Hız Problemleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aralarında 360 km bulunan iki araç birbirine doğru 50 km/s ve 40 km/s hızlarla aynı anda hareket ederse kaç saat sonra karşılaşırlar?",
    "explanation": "t = 360 / (50 + 40) = 360 / 90 = 4 saat sonra karşılaşırlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "4",
        "5",
        "6"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-007",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "İşçi Problemleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir işi Ali tek başına 12 günde, Veli tek başına 6 günde bitirebilmektedir. İkisi birlikte aynı işi kaç günde bitirirler?",
    "explanation": "1/12 + 1/6 = 3/12 = 1/4 olduğundan birlikte 4 günde bitirirler.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "3",
        "4",
        "5",
        "6"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-008",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Veri ve İstatistik",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "4, 7, 10, 13, x veri grubunun aritmetik ortalaması 10 olduğuna göre x kaçtır?",
    "explanation": "(4 + 7 + 10 + 13 + x) / 5 = 10 ⇒ 34 + x = 50 ⇒ x = 16 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "14",
        "15",
        "16",
        "18"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-009",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Mantık",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "(p ∧ q) ≡ 1 ve (q ⇒ r) ≡ 0 olduğuna göre p, q, r önermelerinin doğruluk değerleri sırasıyla nedir?",
    "explanation": "p ∧ q ≡ 1 ise p ≡ 1 ve q ≡ 1 olur. 1 ⇒ r ≡ 0 olması için r ≡ 0 olmalıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1, 1, 0",
        "1, 0, 1",
        "0, 1, 0",
        "1, 1, 1"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-MAT-M-010",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Dik Üçgen ve Pisagor",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Dik kenar uzunlukları 9 cm ve 12 cm olan bir dik üçgenin hipotenüs uzunluğu kaç cm olur?",
    "explanation": "3-4-5 özel üçgeninin 3 katı olan 9-12-15 dik üçgeninden hipotenüs 15 cm bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "13",
        "14",
        "15",
        "16"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-001",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Sözcükte Anlam",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Keskin\" sözcüğü aşağıdaki cümlelerin hangisinde mecaz anlamda kullanılmıştır?",
    "explanation": "\"Keskin zekâ\" ifadesinde sözcük gerçek kesicilik anlamından uzaklaşarak \"kıvrak, güçlü\" mecaz anlamında kullanılmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Bıçağın keskin tarafına dikkat et.",
        "Keskin bir zekâya sahip olduğu hemen anlaşılıyordu.",
        "Camın keskin kenarı elini çizdi.",
        "Baltanın ağzı oldukça keskindi."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-002",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Yazım Kuralları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerin hangisinde \"de / da\" bağlacının yazımıyla ilgili bir yanlışlık yapılmıştır?",
    "explanation": "\"Ahmet de\" bağlaç olduğu için ayrı yazılmalı ve benzeşmeye uğramamalıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sen de bizimle sinemaya gelecek misin?",
        "Kitabımı okulda unutmuşum.",
        "Bu soruyu Ahmet'te doğru çözmüş.",
        "Toplantıda önemli kararlar alındı."
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-003",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Noktalama İşaretleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Tamamlanmış cümlelerin sonuna aşağıdaki noktalama işaretlerinden hangisi konur?",
    "explanation": "Yüklemi bulunan ve yargısı tamamlanmış cümlelerin sonuna nokta konur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Virgül",
        "Noktalı virgül",
        "Nokta",
        "İki nokta"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-004",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Cümlede Anlam",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerin hangisinde \"neden-sonuç\" ilişkisi vardır?",
    "explanation": "Maçın ertelenmesinin gerçekleşmiş nedeni yağmurun şiddetli yağmasıdır (neden-sonuç).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Sınavı kazanmak için gece gündüz çalıştı.",
        "Yağmur şiddetli yağdığından maç ertelendi.",
        "Seni görmek üzere buraya geldim.",
        "Başarılı olmak adına plan yaptı."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-005",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Sözcük Türleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Hızlı tren istasyona zamanında ulaştı.\" cümlesinde \"hızlı\" sözcüğünün türü nedir?",
    "explanation": "\"Tren\" ismini nitelediği için \"hızlı\" sözcüğü niteleme sıfatıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İsim",
        "Sıfat",
        "Zarf",
        "Zamir"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-006",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Ses Bilgisi",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki sözcüklerin hangisinde ünlü düşmesi vardır?",
    "explanation": "Ağız + ı → ağzı sözcüğünde ikinci hecedeki dar ünlü düşmüştür.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Kitapçı",
        "Ağzı",
        "Güzellik",
        "Yolculuk"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-007",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Deyimler ve Atasözleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Çok sevinmek, mutluluktan yerinde duramamak\" anlamına gelen deyim aşağıdakilerden hangisidir?",
    "explanation": "\"Etekleri zil çalmak\" çok sevinmek anlamında kullanılan bir deyimdir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Burnunda tütmek",
        "Etekleri zil çalmak",
        "Gözden düşmek",
        "Kulak kabartmak"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-008",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Cümlede Anlam - Öznel/Nesnel",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerden hangisi kanıtlanabilirlik açısından nesnel bir yargı içerir?",
    "explanation": "Kitabın bölüm ve sayfa sayısı kişiden kişiye değişmeyen, kanıtlanabilir nesnel bir bilgidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İstanbul dünyanın en etkileyici şehridir.",
        "Roman üç bölüm ve 240 sayfadan oluşuyor.",
        "Şairin son şiiri oldukça duygusaldı.",
        "Bu film izlediğim en sürükleyici yapımdı."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-009",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Sözcükte Anlam - Terim Anlam",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki cümlelerin hangisinde \"perde\" sözcüğü tiyatro terimi olarak kullanılmıştır?",
    "explanation": "Tiyatro eserinin bölümlerinden her birine \"perde\" denir ve terim anlamlıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Güneşliği çekip perdeleri kapattı.",
        "Oyunun ikinci perdesi büyük alkış aldı.",
        "Gözündeki perde kalkınca gerçeği gördü.",
        "Kazların ayakları perdeli yapıdadır."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-E-010",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Yazım Kuralları - \"ki\"nin Yazımı",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "Aşağıdaki sözcüklerden hangisinde kalıplaşmış \"ki\" bağlacının yazımı doğrudur?",
    "explanation": "SOMBAHÇEM kodlamasındaki \"sanki, oysaki, mademki, belki, halbuki, çünkü, eğerki, meğerki\" bitişik yazılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Halbu ki",
        "Sanki",
        "Madem ki",
        "Oysa ki"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-001",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Cümle Türleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Sanatçı, eserinde doğayı betimlerken okurun hayal gücüne de geniş bir alan bırakıyor.\" cümlesi yapıca nasıl bir cümledir?",
    "explanation": "İçinde fiilimsi (\"betimlerken\" zarf-fiil) bulunan tek yüklemli cümleler girişik birleşik cümledir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Basit cümle",
        "Girişik birleşik cümle",
        "Sıralı cümle",
        "Bağlı cümle"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-002",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Fiilde Çatı",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aşağıdaki cümlelerin hangisinde yüklem edilgen çatılı bir fiildir?",
    "explanation": "\"Açıklandı\" yükleminde işi yapan gerçek özne belli değildir; \"sınav sonuçları\" sözde öznedir (edilgen çatı).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Çocuklar bahçede neşeyle koşuşturdu.",
        "Sınav sonuçları dün akşam açıklandı.",
        "Annem lezzetli bir kek yaptı.",
        "Kuşlar sıcak ülkelere göç etti."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-003",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Yazım Kuralları - Birleşik Sözcükler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aşağıdaki birleşik sözcüklerden hangisinin yazımı yanlıştır?",
    "explanation": "Ses düşmesi veya türemesi olmayan yardımcı fiilli birleşik fiiller ayrı yazılır: \"fark etmek\" olmalıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Başvuru",
        "Öngörü",
        "Farketmek",
        "Vazgeçmek"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-004",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Karma Dil Bilgisi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Karanlık sokaklardan geçerken adımlarını hızlandırdı.\" cümlesinde aşağıdakilerden hangisi yoktur?",
    "explanation": "\"Karanlık sokaklar\" sıfat tamlamasıdır, \"geçerken\" zarf-fiildir, \"adımlarını\"nda ikinci -ı belirtme durum ekidir; belirtili isim tamlaması yoktur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Niteleme sıfatı",
        "Zarf-fiil",
        "Belirtili isim tamlaması",
        "Belirtme durum eki"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-005",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Noktalama İşaretleri",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Cümle içinde virgüllerle ayrılmış tür veya takımları birbirinden ayırmak için hangi noktalama işareti kullanılır?",
    "explanation": "Virgüllerle ayrılmış kümeleri birbirinden ayırmak için noktalı virgül (;) kullanılır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İki nokta",
        "Noktalı virgül",
        "Kısa çizgi",
        "Üç nokta"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-006",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Sözcük Türleri - Zamirler",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Bunu sana kim söylediyse doğruyu anlatmamış.\" cümlesinde kaç tane zamir (adıl) vardır?",
    "explanation": "\"Bunu\" (işaret zamiri), \"sana\" (kişi zamiri) ve \"kim\" (soru zamiri) olmak üzere 3 zamir vardır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-007",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Ek Fiil (Ek Eylem)",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Aşağıdaki cümlelerin hangisinde ek fiil, basit zamanlı bir fiili birleşik zamanlı yapma göreviyle kullanılmıştır?",
    "explanation": "\"Gider-di-k\" fiilinde geniş zamanın hikayesi (birleşik zaman) ek fiille kurulmuştur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Hava bugün oldukça soğuktu.",
        "En sevdiği mevsim ilkbaharmış.",
        "Çocukken her yaz köye giderdik.",
        "Sınıfın en çalışkan öğrencisi odur."
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-008",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Anlatım Bozuklukları - Dil Bilgisi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "\"Öğrencilere konuyu ayrıntılı anlattı ve soru çözdürdü.\" cümlesindeki öge eksikliği hangisidir?",
    "explanation": "İlk cümledeki \"konuyu\" nesnesi ikinci yükleme uymaz; ikinci yüklemden önce \"onlara\" veya \"öğrencilere\" dolaylı tümleci ortaktır ancak \"konuyu\" nesnesi ortak olamaz (nesne/tümleç uyuşmazlığı).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Özne eksikliği",
        "Dolaylı tümleç eksikliği",
        "Belirtili nesne eksikliği",
        "Zarf tümleci eksikliği"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-009",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Düşünceyi Geliştirme Yolları",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Bir yazarın kendi görüşünü desteklemek amacıyla alanında uzman bir kişinin sözünü tırnak içinde doğrudan aktarmasına ne ad verilir?",
    "explanation": "Uzman bir kişinin adını ve sözünü doğrudan kullanmaya tanık gösterme denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Örnekleme",
        "Tanık gösterme (Alıntı yapma)",
        "Karşılaştırma",
        "Benzetme"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-H-010",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Cümlenin Ögeleri - Vurgu",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Yüklemi fiil olan kurallı bir Türkçe cümlede vurgu hangi öge üzerindedir?",
    "explanation": "Fiil cümlelerinde vurgu, yüklemden hemen önce gelen öge üzerindedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Her zaman öznede",
        "Yüklemden hemen önceki ögede",
        "Cümlenin en başında",
        "Yüklemden sonraki ögede"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-001",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Cümlenin Ögeleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Genç yazar, son romanında çocukluk yıllarını içtenlikle anlatmış.\" cümlesinin nesnesi aşağıdakilerden hangisidir?",
    "explanation": "Neyi anlatmış? → \"çocukluk yıllarını\" belirtili nesnedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Genç yazar",
        "son romanında",
        "çocukluk yıllarını",
        "içtenlikle"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-002",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Fiilimsiler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki cümlelerin hangisinde sıfat-fiil (ortaç) kullanılmıştır?",
    "explanation": "\"Okunacak kitaplar\" tamlamasında \"-acak\" eki sıfat-fiil (ortaç) ekidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Koşarak yanımıza geldi.",
        "Okunacak kitapları masaya ayırdım.",
        "Gülüp geçmek bazen en iyisidir.",
        "Eve varmadan beni ara."
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-003",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Paragrafta Ana Düşünce",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir yazarın eserinin kalıcı olmasını sağlayan temel unsur, kendi çağının sorunlarını anlatırken tüm insanlığın ortak duygularına dokunabilmesidir. Bu cümlede vurgulanan kavram hangisidir?",
    "explanation": "Tüm insanlığın ortak duygularına seslenebilmek \"evrensellik\" ilkesidir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Özgünlük",
        "Evrensellik",
        "Akıcılık",
        "Duruluk"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-004",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Ses Olayları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Kayıp etti\" birleşik fiili \"kaybetti\" şeklinde yazıldığında hangi iki ses olayı bir arada görülür?",
    "explanation": "Kayıp → kayb- olurken \"ı\" ünlüsü düşmüş (ünlü düşmesi) ve \"p\" ünsüzü \"b\"ye dönüşmüştür (ünsüz yumuşaması).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ünsüz türemesi - Ünlü daralması",
        "Ünlü düşmesi - Ünsüz yumuşaması",
        "Ünsüz benzeşmesi - Ünlü daralması",
        "Ulama - Kaynaştırma"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-005",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Anlatım Bozuklukları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Şüphesiz bu sınavı kesinlikle kazanabilir.\" cümlesindeki anlatım bozukluğunun nedeni nedir?",
    "explanation": "Kesinlik bildiren \"şüphesiz / kesinlikle\" ile olasılık bildiren \"kazanabilir\" bir arada kullanıldığı için anlamca çelişmektedir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Özne-yüklem uyuşmazlığı",
        "Çelişen sözcüklerin bir arada kullanılması",
        "Gereksiz yardımcı fiil kullanımı",
        "Tamlama yanlışlığı"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-006",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Yapı Bilgisi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki sözcüklerden hangisi hem yapım hem çekim eki almıştır?",
    "explanation": "Kitap-lık (yapım eki) + -ımız (iyelik çekim eki) hem yapım hem çekim eki almıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Evler",
        "Gözlükçü",
        "Kitaplığımız",
        "Yollar"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-007",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "İsim Tamlamaları",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki tamlamalardan hangisi belirtisiz isim tamlamasıdır?",
    "explanation": "\"Bahçe duvarı\"nda tamlayan (bahçe) ek almamış, tamlanan (duvar-ı) iyelik eki almıştır (belirtisiz isim tamlaması).",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Okulun kapısı",
        "Bahçe duvarı",
        "Geniş sokak",
        "Kırmızı kalem"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-008",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Paragrafta Anlatım Teknikleri",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Bir yeri veya varlığı okuyucunun zihninde resmeder gibi görsel ayrıntılarla anlatma biçimine ne ad verilir?",
    "explanation": "Sözcüklerle resim çizme sanatına betimleme (tasvir) denir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Tartışma",
        "Açıklama",
        "Betimleme (Tasvir)",
        "Kanıtlama"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-009",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Zarf (Belirteç)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "\"Akşamları sahilde yavaşça yürürdü.\" cümlesinde \"yavaşça\" sözcüğü hangi tür zarftır?",
    "explanation": "\"Nasıl yürürdü?\" sorusuna yanıt verdiği için durum zarfıdır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Zaman zarfı",
        "Durum zarfı",
        "Miktar zarfı",
        "Yer-yön zarfı"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "TYT-TUR-M-010",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Ünsüz Benzeşmesi (Sertleşmesi)",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Aşağıdaki sözcüklerin hangisinde ünsüz benzeşmesi (sertleşmesi) vardır?",
    "explanation": "Kitap + dan → kitaptan sözcüğünde \"p\" sert ünsüzü \"-dan\" ekini \"-tan\"a benzeştirmiştir.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Ağaca",
        "Kitaptan",
        "Yüreği",
        "Gönlü"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "q_uc_test_001",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Türev ve Teğet Eğimi",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "f(x) = 3x² - 4x + 7 fonksiyonunun x = 2 noktasındaki teğetinin eğimi (f'(2)) kaçtır?",
    "explanation": "f'(x) = 6x - 4 türevidir. x = 2 için f'(2) = 6(2) - 4 = 12 - 4 = 8 bulunur.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "6",
        "8",
        "10",
        "12"
      ],
      "correctIndex": 1,
      "shuffleOptions": true
    }
  },
  {
    "id": "q_uc_tf_002",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Dalgalar ve Ses",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 10,
    "points": 80,
    "prompt": "Ses dalgaları yayılmak için maddesel ortama ihtiyaç duyar; bu sebeple uzay boşluğunda yayılamaz.",
    "explanation": "Doğru! Ses mekanik bir dalgadır ve parçacıkların titreşimiyle yayılır. Boşlukta madde olmadığı için ses iletilemez.",
    "payload": {
      "variant": "true_false",
      "optionCount": 2,
      "options": [
        "Doğru",
        "Yanlış"
      ],
      "correctIndex": 0,
      "shuffleOptions": false
    }
  },
  {
    "id": "q_uc_comp_003",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Trigonometrik Değerler",
    "type": "universal_choice",
    "difficulty": "orta",
    "timeLimitSeconds": 15,
    "points": 100,
    "prompt": "Sol ve sağdaki ifadeleri karşılaştırarak aralarındaki doğru ilişkiyi seçin:",
    "explanation": "Tümler açılarda sin(30°) = cos(60°) = 1/2 olduğundan her iki değer birbirine eşittir (=).",
    "payload": {
      "variant": "comparison",
      "optionCount": 3,
      "comparisonItems": {
        "left": "sin(30°)",
        "right": "cos(60°)"
      },
      "options": [
        "<",
        "=",
        ">"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "q_uc_odd_004",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Periyodik Sistem ve Element Sınıfları",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 12,
    "points": 90,
    "prompt": "Aşağıdaki elementlerden hangisi gruba uymaz (soygaz değildir)?",
    "explanation": "Helyum (He), Neon (Ne) ve Argon (Ar) 8A grubu soygazlarıdır. Klor (Cl) ise 7A grubu halojenidir.",
    "payload": {
      "variant": "odd_one_out",
      "optionCount": 4,
      "options": [
        "Helyum (He)",
        "Neon (Ne)",
        "Klor (Cl)",
        "Argon (Ar)"
      ],
      "correctIndex": 2,
      "shuffleOptions": true
    }
  },
  {
    "id": "q_of_seq_005",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Bölünmesi (Mitoz)",
    "type": "ordering_and_formula",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 150,
    "prompt": "Mitoz bölünmenin karyokinez (çekirdek bölünmesi) evrelerini gerçekleşme sırasına göre dizin.",
    "explanation": "Mitozun doğru evre sırası: Profaz -> Metafaz -> Anafaz -> Telofaz (PMAT kuralı).",
    "payload": {
      "mode": "sequence",
      "directionLabel": "İlk Evreden -> Son Evreye",
      "items": [
        "Telofaz",
        "Profaz",
        "Anafaz",
        "Metafaz"
      ],
      "correctOrder": [
        "Profaz",
        "Metafaz",
        "Anafaz",
        "Telofaz"
      ]
    }
  },
  {
    "id": "q_of_form_006",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Newton'un Hareket Yasaları",
    "type": "ordering_and_formula",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 150,
    "prompt": "Newton'un 2. Hareket Yasası'nın temel formülünü blokları doğru sırayla yerleştirerek kurun:",
    "explanation": "Net kuvvet, kütle ile ivmenin çarpımına eşittir: F = m × a.",
    "payload": {
      "mode": "formula_builder",
      "template": "[ ? ] = [ ? ] × [ ? ]",
      "items": [
        "m",
        "F",
        "v",
        "a",
        "t"
      ],
      "correctOrder": [
        "F",
        "m",
        "a"
      ]
    }
  },
  {
    "id": "q_pm_007",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Temel Türev Alma Kuralları",
    "type": "pair_matching",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 200,
    "prompt": "Sol sütundaki fonksiyonları sağ sütundaki birinci türevleriyle eşleştirin.",
    "explanation": "(x³)' = 3x², (sin x)' = cos x, (ln x)' = 1/x, (eˣ)' = eˣ türev kurallarıdır.",
    "payload": {
      "leftColumnTitle": "Fonksiyon f(x)",
      "rightColumnTitle": "Türevi f'(x)",
      "pairs": [
        {
          "pairId": "pm_1",
          "leftText": "x³",
          "rightText": "3x²"
        },
        {
          "pairId": "pm_2",
          "leftText": "sin(x)",
          "rightText": "cos(x)"
        },
        {
          "pairId": "pm_3",
          "leftText": "ln(x)",
          "rightText": "1 / x"
        },
        {
          "pairId": "pm_4",
          "leftText": "eˣ",
          "rightText": "eˣ"
        }
      ]
    }
  },
  {
    "id": "q_sw_008",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Fiziksel Büyüklükler (Skaler vs Vektörel)",
    "type": "swipe_grouping",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 200,
    "prompt": "Gelen fiziksel büyüklükleri SOLA (Skaler) veya SAĞA (Vektörel) kaydırarak sınıflandır!",
    "explanation": "Yönü olan büyüklükler vektörel (Kuvvet, Yer Değiştirme, Hız); yönü olmayan sadece sayı ve birimle ifade edilenler skalerdir (Kütle, Sıcaklık, Enerji).",
    "payload": {
      "leftCategory": {
        "id": "left",
        "label": "⬅️ Skaler Büyüklük"
      },
      "rightCategory": {
        "id": "right",
        "label": "Vektörel Büyüklük ➡️"
      },
      "cards": [
        {
          "id": "c1",
          "text": "Kütle",
          "correctCategory": "left"
        },
        {
          "id": "c2",
          "text": "Kuvvet",
          "correctCategory": "right"
        },
        {
          "id": "c3",
          "text": "Sıcaklık",
          "correctCategory": "left"
        },
        {
          "id": "c4",
          "text": "Yer Değiştirme",
          "correctCategory": "right"
        },
        {
          "id": "c5",
          "text": "Hız",
          "correctCategory": "right"
        },
        {
          "id": "c6",
          "text": "Enerji",
          "correctCategory": "left"
        }
      ]
    }
  },
  {
    "id": "q_np_009",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Mol Kavramı ve Bağıl Molekül Kütlesi",
    "type": "numpad_closest",
    "difficulty": "orta",
    "timeLimitSeconds": 15,
    "points": 150,
    "prompt": "Suyun (H₂O) mol kütlesi kaç g/mol'dür? (H: 1, O: 16)",
    "explanation": "H₂O için: 2·(1) + 16 = 18 g/mol.",
    "payload": {
      "correctAnswer": 18,
      "unit": "g/mol",
      "allowDecimals": false,
      "allowNegative": false,
      "min": 1,
      "max": 200
    }
  },
  {
    "id": "q_mb_010",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Zarından Madde Geçişleri",
    "type": "multi_select_bubble",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 180,
    "prompt": "Hücre zarından doğrudan (sindirilmeden/fagositozsuz) geçebilen monomer ve küçük molekülleri patlatın!",
    "explanation": "Glikoz, Amino Asit ve Oksijen küçük monomer/gazlardır ve zardan doğrudan geçer. Nişasta, Protein ve Glikojen makromoleküldür, sindirilmeden geçemez.",
    "payload": {
      "instruction": "Doğrudan geçebilen tüm küçük molekülleri seçin:",
      "minRequiredCorrect": 3,
      "items": [
        {
          "id": "b1",
          "text": "Glikoz",
          "isCorrect": true
        },
        {
          "id": "b2",
          "text": "Nişasta",
          "isCorrect": false
        },
        {
          "id": "b3",
          "text": "Amino Asit",
          "isCorrect": true
        },
        {
          "id": "b4",
          "text": "Protein",
          "isCorrect": false
        },
        {
          "id": "b5",
          "text": "Oksijen",
          "isCorrect": true
        },
        {
          "id": "b6",
          "text": "Glikojen",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": "q_sb_011",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Kimyasal Tepkime Denkleştirme",
    "type": "stepper_balance",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 180,
    "prompt": "Propan gazının yanma tepkimesini katsayıları ayarlayarak en küçük tam sayılarla denkleştirin:",
    "explanation": "1 C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O katsayılarıyla C (3), H (8) ve O (10) atomları her iki tarafta eşitlenir.",
    "payload": {
      "equationTemplate": "[ {s1} ] C₃H₈ + [ {s2} ] O₂ → [ {s3} ] CO₂ + [ {s4} ] H₂O",
      "targetDescription": "Her iki taraftaki C, H ve O atom sayılarını dengeleyin",
      "slots": [
        {
          "id": "s1",
          "label": "C₃H₈",
          "initialValue": 1,
          "correctValue": 1,
          "min": 1,
          "max": 10
        },
        {
          "id": "s2",
          "label": "O₂",
          "initialValue": 1,
          "correctValue": 5,
          "min": 1,
          "max": 10
        },
        {
          "id": "s3",
          "label": "CO₂",
          "initialValue": 1,
          "correctValue": 3,
          "min": 1,
          "max": 10
        },
        {
          "id": "s4",
          "label": "H₂O",
          "initialValue": 1,
          "correctValue": 4,
          "min": 1,
          "max": 10
        }
      ]
    }
  },
  {
    "id": "q_stb_012",
    "examType": "TYT",
    "subject": "matematik",
    "topic": "Birinci Dereceden Denklemler",
    "type": "spot_the_bug",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 140,
    "prompt": "3(2x - 4) + 5 = 23 denklemini çözen öğrencinin yaptığı İLK HATALI adımı seçin:",
    "explanation": "2. Adımda parantez açılırken 3 katsayısı -4 ile çarpılmamış (-12 yerine -4 yazılmıştır).",
    "payload": {
      "contextPrompt": "Denklem: 3(2x - 4) + 5 = 23",
      "displayLayout": "vertical_steps",
      "blocks": [
        {
          "id": "b1",
          "blockText": "1. Adım: 3(2x - 4) = 18",
          "isBug": false
        },
        {
          "id": "b2",
          "blockText": "2. Adım: 6x - 4 = 18",
          "isBug": true,
          "feedbackNote": "Dağılma hatası: 6x - 12 = 18 olmalıydı."
        },
        {
          "id": "b3",
          "blockText": "3. Adım: 6x = 22",
          "isBug": false
        },
        {
          "id": "b4",
          "blockText": "4. Adım: x = 11/3",
          "isBug": false
        }
      ]
    }
  },
  {
    "id": "q_pc_013",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Periyodik Sistem ve Elementler",
    "type": "progressive_clues",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 400,
    "prompt": "Açılan ipuçlarını takip ederek gizemli elementi en kısa sürede bulun!",
    "explanation": "Alüminyum (Al): 3. periyot 3A grubunda yer alır, amfoter metaldir, bileşiklerinde +3 alır ve atom numarası 13'tür.",
    "payload": {
      "options": [
        "Magnezyum",
        "Alüminyum",
        "Silisyum",
        "Çinko"
      ],
      "correctIndex": 1,
      "revealIntervalSeconds": 4,
      "clues": [
        {
          "stage": 1,
          "secondsToReveal": 0,
          "clueText": "Hem asitlerle hem de kuvvetli bazlarla tepkimeye giren amfoter bir metalim.",
          "pointsReward": 400
        },
        {
          "stage": 2,
          "secondsToReveal": 4,
          "clueText": "Periyodik tablonun 3. periyot 3A (13.) grubunda yer alırım.",
          "pointsReward": 300
        },
        {
          "stage": 3,
          "secondsToReveal": 8,
          "clueText": "Bileşiklerimde yalnızca +3 yükseltgenme basamağına sahibim.",
          "pointsReward": 200
        },
        {
          "stage": 4,
          "secondsToReveal": 12,
          "clueText": "Sembolüm 'Al' ve atom numaram 13'tür.",
          "pointsReward": 100
        }
      ]
    }
  },
  {
    "id": "q_tc_014",
    "examType": "TYT",
    "subject": "fizik",
    "topic": "Elektrik Akımı ve Direnç Bağlantıları",
    "type": "target_combination",
    "difficulty": "orta",
    "timeLimitSeconds": 15,
    "points": 160,
    "prompt": "Paralel bağlandıklarında eşdeğer direnci 4 Ω yapan İKİ direnci seçin:",
    "explanation": "Paralel bağlı 6 Ω ve 12 Ω için eşdeğer direnç: (6 × 12) / (6 + 12) = 72 / 18 = 4 Ω olur.",
    "payload": {
      "targetBadge": "Hedef: Eşdeğer Direnç = 4 Ω",
      "ruleHint": "Paralel bağlandığında 4 Ω veren 2 direnci seçin",
      "options": [
        {
          "id": "r1",
          "label": "2 Ω"
        },
        {
          "id": "r2",
          "label": "6 Ω"
        },
        {
          "id": "r3",
          "label": "8 Ω"
        },
        {
          "id": "r4",
          "label": "12 Ω"
        },
        {
          "id": "r5",
          "label": "16 Ω"
        }
      ],
      "correctPairIds": [
        "r2",
        "r4"
      ]
    }
  },
  {
    "id": "q_cc_015",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücresel Enerji Dönüşümleri",
    "type": "chain_conversion",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 170,
    "prompt": "Güneş ışığından başlayarak hücresel enerjinin üretim zincirini tamamlayın:",
    "explanation": "Güneş enerjisi kloroplastta glikozun kimyasal bağ enerjisine, ardından mitokondride hücresel solunumla ATP'ye dönüştürülür.",
    "payload": {
      "startEntity": "Güneş Işığı Enerjisi",
      "steps": [
        {
          "stepNumber": 1,
          "arrowLabel": "Kloroplast (Fotosentez)",
          "correctValue": "Glikoz (Kimyasal Bağ)"
        },
        {
          "stepNumber": 2,
          "arrowLabel": "Mitokondri (Solunum)",
          "correctValue": "ATP Enerjisi"
        }
      ],
      "poolOptions": [
        "Glikoz (Kimyasal Bağ)",
        "ATP Enerjisi",
        "Kreatin Fosfat",
        "Glikojen Deposu",
        "Isı Enerjisi"
      ]
    }
  },
  {
    "id": "q_mt_016",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Bölünmeleri Karşılaştırması",
    "type": "matrix_toggle",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 190,
    "prompt": "Mitoz ve Mayoz bölünme özelliklerini tablodaki hücrelere dokunarak (✓ / ✗) doldurun:",
    "explanation": "Mitozda krossing-over görülmez (✗), vücut hücresinde görülür (✓). Mayozda krossing-over görülür (✓), üreme ana hücrelerinde görülür (vücut hücresinde değil ✗).",
    "payload": {
      "tablePrompt": "Her hücreyi ✓ (Evet) veya ✗ (Hayır) olarak işaretleyin:",
      "rows": [
        {
          "id": "r_mitoz",
          "title": "Mitoz"
        },
        {
          "id": "r_mayoz",
          "title": "Mayoz"
        }
      ],
      "columns": [
        {
          "id": "c_kross",
          "title": "Krossing-over Görülür"
        },
        {
          "id": "c_somat",
          "title": "Vücut Hücresinde Görülür"
        }
      ],
      "answers": [
        {
          "rowId": "r_mitoz",
          "colId": "c_kross",
          "expectedBool": false
        },
        {
          "rowId": "r_mitoz",
          "colId": "c_somat",
          "expectedBool": true
        },
        {
          "rowId": "r_mayoz",
          "colId": "c_kross",
          "expectedBool": true
        },
        {
          "rowId": "r_mayoz",
          "colId": "c_somat",
          "expectedBool": false
        }
      ]
    }
  },
  {
    "id": "q_sl_017",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Tork ve Kaldıraç Dengesi",
    "type": "slider",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 150,
    "prompt": "Destek noktasının solunda 3 birim uzaklıkta 40 N ağırlık var. Çubuğun yatay dengede kalması için sağ tarafta 2 birim uzaklıktaki F kuvvetini sürgü ile ayarlayın!",
    "explanation": "Sol tork = Sağ tork => 40 · 3 = F · 2 => 120 = 2F => F = 60 N olmalıdır.",
    "payload": {
      "min": 0,
      "max": 100,
      "step": 5,
      "initialValue": 20,
      "unit": "N",
      "targetValue": 60,
      "tolerance": 0,
      "visualSimulationType": "torque_seesaw"
    }
  },
  {
    "id": "q_hs_018",
    "examType": "TYT",
    "subject": "biyoloji",
    "topic": "Hücre Organelleri",
    "type": "hotspot",
    "difficulty": "orta",
    "timeLimitSeconds": 15,
    "points": 150,
    "prompt": "Verilen ökaryot hücre modeli üzerinde 'Golgi Cisimciği'nin bulunduğu bölgeye dokunun!",
    "explanation": "Golgi cisimciği üst üste dizilmiş yassı keseciklerden (sisternalardan) oluşur; protein ve lipitlerin paketlenmesinden ve salgılanmasından sorumludur.",
    "payload": {
      "imageUrl": "/eukaryotic-cell.svg",
      "imageAlt": "Ökaryot hücre şeması ve organelleri",
      "regions": [
        {
          "id": "reg_nucleus",
          "label": "Çekirdek",
          "xPercent": 48,
          "yPercent": 50,
          "radiusPercent": 12
        },
        {
          "id": "reg_golgi",
          "label": "Golgi Cisimciği",
          "xPercent": 65,
          "yPercent": 62,
          "radiusPercent": 8
        },
        {
          "id": "reg_mito",
          "label": "Mitokondri",
          "xPercent": 28,
          "yPercent": 38,
          "radiusPercent": 8
        },
        {
          "id": "reg_vacuole",
          "label": "Koful",
          "xPercent": 29,
          "yPercent": 69,
          "radiusPercent": 8
        }
      ],
      "correctRegionId": "reg_golgi"
    }
  },
  {
    "id": "q_hs_019",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Parabol ve Tepe Noktası",
    "type": "hotspot",
    "difficulty": "orta",
    "timeLimitSeconds": 15,
    "points": 160,
    "prompt": "Koordinat düzleminde verilen f(x) = x² - 4 parabolünün Tepe Noktasının (T) bulunduğu bölgeye dokunun!",
    "explanation": "f(x) = x² - 4 parabolünün simetri ekseni r = 0 ve minimum değeri k = -4 olduğundan tepe noktası T(0, -4) noktasıdır.",
    "payload": {
      "imageUrl": "",
      "imageAlt": "f(x) = x² - 4 parabol grafiği",
      "regions": [
        {
          "id": "reg_vertex",
          "label": "T(0, -4)",
          "xPercent": 50,
          "yPercent": 74,
          "radiusPercent": 8
        },
        {
          "id": "reg_root_left",
          "label": "Kök (-2, 0)",
          "xPercent": 35,
          "yPercent": 50,
          "radiusPercent": 8
        },
        {
          "id": "reg_root_right",
          "label": "Kök (+2, 0)",
          "xPercent": 65,
          "yPercent": 50,
          "radiusPercent": 8
        },
        {
          "id": "reg_origin",
          "label": "Orijin (0, 0)",
          "xPercent": 50,
          "yPercent": 50,
          "radiusPercent": 8
        }
      ],
      "correctRegionId": "reg_vertex"
    }
  },
  {
    "id": "q_pm_020",
    "examType": "AYT",
    "subject": "turkce",
    "topic": "Cumhuriyet Dönemi Roman ve Yazar Eşleştirmesi",
    "type": "pair_matching",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 200,
    "prompt": "Sol sütundaki başyapıt romanları sağ sütundaki yazarlarımızla eşleştirin.",
    "explanation": "Tutunamayanlar -> Oğuz Atay, Saatleri Ayarlama Enstitüsü -> Ahmet Hamdi Tanpınar, İnce Memed -> Yaşar Kemal, Kürk Mantolu Madonna -> Sabahattin Ali.",
    "payload": {
      "leftColumnTitle": "Roman",
      "rightColumnTitle": "Yazar",
      "pairs": [
        {
          "pairId": "lit_1",
          "leftText": "Tutunamayanlar",
          "rightText": "Oğuz Atay"
        },
        {
          "pairId": "lit_2",
          "leftText": "Saatleri Ayarlama Enstitüsü",
          "rightText": "Ahmet Hamdi Tanpınar"
        },
        {
          "pairId": "lit_3",
          "leftText": "İnce Memed",
          "rightText": "Yaşar Kemal"
        },
        {
          "pairId": "lit_4",
          "leftText": "Kürk Mantolu Madonna",
          "rightText": "Sabahattin Ali"
        }
      ]
    }
  },
  {
    "id": "q_sw_021",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Kimyasal Tepkimelerde Enerji (Endotermik vs Ekzotermik)",
    "type": "swipe_grouping",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 200,
    "prompt": "Verilen olayları SOLA (Endotermik / Isı Alan) veya SAĞA (Ekzotermik / Isı Veren) kaydırarak sınıflandırın!",
    "explanation": "Erime, buharlaşma ve azot gazının yanması ısı alan (endotermik, ΔH > 0); doğalgazın yanması, nötralleşme ve donma ısı veren (ekzotermik, ΔH < 0) olaylardır.",
    "payload": {
      "leftCategory": {
        "id": "left",
        "label": "⬅️ Endotermik (ΔH > 0)"
      },
      "rightCategory": {
        "id": "right",
        "label": "Ekzotermik (ΔH < 0) ➡️"
      },
      "cards": [
        {
          "id": "e1",
          "text": "Buzun Erimesi",
          "correctCategory": "left"
        },
        {
          "id": "e2",
          "text": "Doğalgazın Yanması",
          "correctCategory": "right"
        },
        {
          "id": "e3",
          "text": "Suyun Buharlaşması",
          "correctCategory": "left"
        },
        {
          "id": "e4",
          "text": "Asit-Baz Nötralleşmesi",
          "correctCategory": "right"
        },
        {
          "id": "e5",
          "text": "Azot Gazının Yanması",
          "correctCategory": "left"
        },
        {
          "id": "e6",
          "text": "Suyun Donması",
          "correctCategory": "right"
        }
      ]
    }
  },
  {
    "id": "q_of_seq_022",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Oksijenli Solunum Evreleri",
    "type": "ordering_and_formula",
    "difficulty": "zor",
    "timeLimitSeconds": 25,
    "points": 180,
    "prompt": "Ökaryot bir hücrede glikozun oksijenli solunumla yıkım evrelerini gerçekleşme sırasına göre dizin.",
    "explanation": "Oksijenli solunum sırasıyla: Glikoliz (Sitoplazma) -> Pirüvat Oksidasyonu -> Krebs Döngüsü (Matriks) -> ETS (Krista) aşamalarıyla gerçekleşir.",
    "payload": {
      "mode": "sequence",
      "directionLabel": "İlk Evreden -> Son Evreye",
      "items": [
        "Krebs Döngüsü",
        "Glikoliz",
        "ETS (Elektron Taşıma Sistemi)",
        "Pirüvat Oksidasyonu"
      ],
      "correctOrder": [
        "Glikoliz",
        "Pirüvat Oksidasyonu",
        "Krebs Döngüsü",
        "ETS (Elektron Taşıma Sistemi)"
      ]
    }
  },
  {
    "id": "q_of_form_023",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "İdeal Gaz ve Sığaç Formülü",
    "type": "ordering_and_formula",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 150,
    "prompt": "Bir kondansatörde (sığaçta) depolanan elektrik yükü formülünü blokları doğru sırayla yerleştirerek kurun:",
    "explanation": "Kondansatörde depolanan yük, sığa ile gerilimin çarpımına eşittir: Q = C × V.",
    "payload": {
      "mode": "formula_builder",
      "template": "[ ? ] = [ ? ] × [ ? ]",
      "items": [
        "C",
        "Q",
        "V",
        "R",
        "I"
      ],
      "correctOrder": [
        "Q",
        "C",
        "V"
      ]
    }
  },
  {
    "id": "q_np_024",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Logaritma Hesaplama",
    "type": "numpad_closest",
    "difficulty": "kolay",
    "timeLimitSeconds": 18,
    "points": 150,
    "prompt": "log₂(64) + log₃(81) + log₅(25) işleminin sonucu kaçtır?",
    "explanation": "log₂(2⁶) = 6, log₃(3⁴) = 4 ve log₅(5²) = 2 olduğundan 6 + 4 + 2 = 12 bulunur.",
    "payload": {
      "correctAnswer": 12,
      "unit": "",
      "allowDecimals": false,
      "allowNegative": false,
      "min": 0,
      "max": 100
    }
  },
  {
    "id": "q_mb_025",
    "examType": "TYT",
    "subject": "turkce",
    "topic": "Yazım Kuralları (Birleşik Sözcükler)",
    "type": "multi_select_bubble",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 180,
    "prompt": "TDK Yazım Kılavuzuna göre yazımı DOĞRU olan 3 sözcüğü seçerek baloncukları patlatın!",
    "explanation": "Öngörü, Başvuru ve Vazgeçmek bitişik yazılır (doğru). \"Her şey\", \"fark etmek\" ve \"ya da\" ise ayrı yazılmalıdır.",
    "payload": {
      "instruction": "Yazımı DOĞRU olan 3 sözcüğü seçin:",
      "minRequiredCorrect": 3,
      "items": [
        {
          "id": "w1",
          "text": "Öngörü",
          "isCorrect": true
        },
        {
          "id": "w2",
          "text": "Herşey",
          "isCorrect": false
        },
        {
          "id": "w3",
          "text": "Başvuru",
          "isCorrect": true
        },
        {
          "id": "w4",
          "text": "Farketmek",
          "isCorrect": false
        },
        {
          "id": "w5",
          "text": "Vazgeçmek",
          "isCorrect": true
        },
        {
          "id": "w6",
          "text": "Yada",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": "q_sb_026",
    "examType": "AYT",
    "subject": "kimya",
    "topic": "Kimyasal Denge ve Amonyak Sentezi",
    "type": "stepper_balance",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 170,
    "prompt": "Haber-Bosch amonyak sentezi tepkimesini en küçük tam sayılarla denkleştirin:",
    "explanation": "1 N₂ + 3 H₂ → 2 NH₃ katsayılarıyla her iki tarafta 2 azot ve 6 hidrojen atomu eşitlenir.",
    "payload": {
      "equationTemplate": "[ {s1} ] N₂(g) + [ {s2} ] H₂(g) ⇌ [ {s3} ] NH₃(g)",
      "targetDescription": "Azot (N) ve Hidrojen (H) atom sayılarını dengeleyin",
      "slots": [
        {
          "id": "s1",
          "label": "N₂",
          "initialValue": 1,
          "correctValue": 1,
          "min": 1,
          "max": 6
        },
        {
          "id": "s2",
          "label": "H₂",
          "initialValue": 1,
          "correctValue": 3,
          "min": 1,
          "max": 6
        },
        {
          "id": "s3",
          "label": "NH₃",
          "initialValue": 1,
          "correctValue": 2,
          "min": 1,
          "max": 6
        }
      ]
    }
  },
  {
    "id": "q_stb_027",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Logaritma Denklemleri",
    "type": "spot_the_bug",
    "difficulty": "zor",
    "timeLimitSeconds": 22,
    "points": 180,
    "prompt": "log₂(x) + log₂(x - 2) = 3 denklemini çözen öğrencinin yaptığı İLK HATALI adımı seçin:",
    "explanation": "1. Adımda aynı tabandaki logaritmaların toplamı çarpıma dönüşmeliydi: log₂(x · (x - 2)) = 3 olmalıydı, toplam olarak yazılması hatalıdır.",
    "payload": {
      "contextPrompt": "Denklem: log₂(x) + log₂(x - 2) = 3",
      "displayLayout": "vertical_steps",
      "blocks": [
        {
          "id": "lb1",
          "blockText": "1. Adım: log₂(x + x - 2) = 3",
          "isBug": true,
          "feedbackNote": "Logaritma özelliği hatası: log₂(x · (x - 2)) = 3 olmalıydı!"
        },
        {
          "id": "lb2",
          "blockText": "2. Adım: 2x - 2 = 2³",
          "isBug": false
        },
        {
          "id": "lb3",
          "blockText": "3. Adım: 2x = 10",
          "isBug": false
        },
        {
          "id": "lb4",
          "blockText": "4. Adım: x = 5",
          "isBug": false
        }
      ]
    }
  },
  {
    "id": "q_pc_028",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Endokrin Sistem ve Hormonlar",
    "type": "progressive_clues",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 400,
    "prompt": "İpuçlarını takip ederek insan vücudundaki bu kritik hormonu en erken aşamada bulun!",
    "explanation": "İnsülin hormonu pankreasın Langerhans adacıklarındaki Beta hücrelerinden salgılanır ve kan şekerini düşürür.",
    "payload": {
      "options": [
        "Glukagon",
        "İnsülin",
        "Adrenalin",
        "Tiroksin"
      ],
      "correctIndex": 1,
      "revealIntervalSeconds": 4,
      "clues": [
        {
          "stage": 1,
          "secondsToReveal": 0,
          "clueText": "Peptit (protein) yapılı bir hormonum ve hedef hücre zarındaki reseptörlere bağlanırım.",
          "pointsReward": 400
        },
        {
          "stage": 2,
          "secondsToReveal": 4,
          "clueText": "Pankreasın Langerhans adacıklarındaki Beta (β) hücrelerinden salgılanırım.",
          "pointsReward": 300
        },
        {
          "stage": 3,
          "secondsToReveal": 8,
          "clueText": "Kandaki fazla glikozun çizgili kas ve karaciğerde glikojen olarak depolanmasını sağlarım.",
          "pointsReward": 200
        },
        {
          "stage": 4,
          "secondsToReveal": 12,
          "clueText": "Eksikliğimde veya reseptör direncinde Diyabet (Şeker Hastalığı) ortaya çıkar.",
          "pointsReward": 100
        }
      ]
    }
  },
  {
    "id": "q_tc_029",
    "examType": "AYT",
    "subject": "matematik",
    "topic": "Trigonometrik Özdeşlikler",
    "type": "target_combination",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 150,
    "prompt": "Her x gerçel sayısı için toplamları daima 1 olan İKİ trigonometrik ifadeyi seçin:",
    "explanation": "Temel Pisagor trigonometrik özdeşliğine göre sin²(x) + cos²(x) = 1 olur.",
    "payload": {
      "targetBadge": "Hedef Toplam = 1",
      "ruleHint": "Toplamları özdeş olarak 1 veren 2 ifadeyi seçin",
      "options": [
        {
          "id": "t1",
          "label": "sin²(x)"
        },
        {
          "id": "t2",
          "label": "tan²(x)"
        },
        {
          "id": "t3",
          "label": "cos²(x)"
        },
        {
          "id": "t4",
          "label": "sec²(x)"
        },
        {
          "id": "t5",
          "label": "2·sin(x)"
        }
      ],
      "correctPairIds": [
        "t1",
        "t3"
      ]
    }
  },
  {
    "id": "q_cc_030",
    "examType": "AYT",
    "subject": "biyoloji",
    "topic": "Santral Dogma (Genden Proteine)",
    "type": "chain_conversion",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 170,
    "prompt": "Hücrede genetik bilginin DNA'dan proteine aktarılma zincirini (Santral Dogma) tamamlayın:",
    "explanation": "DNA'daki şifre transkripsiyonla mRNA'ya yazılır, mRNA ise ribozomda translasyonla polipeptit (protein) zincirine dönüştürülür.",
    "payload": {
      "startEntity": "DNA (Genetik Şifre)",
      "steps": [
        {
          "stepNumber": 1,
          "arrowLabel": "Transkripsiyon (Yazılım)",
          "correctValue": "mRNA (Elçi RNA)"
        },
        {
          "stepNumber": 2,
          "arrowLabel": "Translasyon (Ribozomda Okuma)",
          "correctValue": "Polipeptit (Protein)"
        }
      ],
      "poolOptions": [
        "mRNA (Elçi RNA)",
        "Polipeptit (Protein)",
        "Glikojen",
        "Kolesterol",
        "Kitin"
      ]
    }
  },
  {
    "id": "q_mt_031",
    "examType": "TYT",
    "subject": "kimya",
    "topic": "Asitler ve Bazlar Karşılaştırması",
    "type": "matrix_toggle",
    "difficulty": "kolay",
    "timeLimitSeconds": 22,
    "points": 180,
    "prompt": "Oda koşullarındaki (25 °C) sulu asit ve baz çözeltileri için tabloyu (✓ / ✗) olarak doldurun:",
    "explanation": "25 °C sıcaklıkta asitlerin pH değeri 7'den küçüktür (✓), bazların 7'den büyüktür (✗). Her ikisinin sulu çözeltisi de iyon içerdiğinden elektrik akımını iletir (✓).",
    "payload": {
      "tablePrompt": "Her hücreyi ✓ (Evet) veya ✗ (Hayır) olarak işaretleyin:",
      "rows": [
        {
          "id": "r_asit",
          "title": "Asit Sulu Çözeltisi"
        },
        {
          "id": "r_baz",
          "title": "Baz Sulu Çözeltisi"
        }
      ],
      "columns": [
        {
          "id": "c_ph7",
          "title": "pH Değeri 7'den Küçüktür"
        },
        {
          "id": "c_iletken",
          "title": "Elektrik Akımını İletir"
        }
      ],
      "answers": [
        {
          "rowId": "r_asit",
          "colId": "c_ph7",
          "expectedBool": true
        },
        {
          "rowId": "r_asit",
          "colId": "c_iletken",
          "expectedBool": true
        },
        {
          "rowId": "r_baz",
          "colId": "c_ph7",
          "expectedBool": false
        },
        {
          "rowId": "r_baz",
          "colId": "c_iletken",
          "expectedBool": true
        }
      ]
    }
  },
  {
    "id": "q_uc_comp_032",
    "examType": "AYT",
    "subject": "fizik",
    "topic": "Elektromanyetik Dalgalar ve Foton Enerjisi",
    "type": "universal_choice",
    "difficulty": "zor",
    "timeLimitSeconds": 15,
    "points": 120,
    "prompt": "Görünür ışık spektrumundaki iki fotonun enerjilerini karşılaştırarak doğru ilişkiyi seçin:",
    "explanation": "Mavi ışığın frekansı kırmızı ışıktan daha büyüktür (dalga boyu daha küçüktür). E = h·f bağıntısına göre mavi fotonun enerjisi > kırmızı fotonun enerjisidir.",
    "payload": {
      "variant": "comparison",
      "optionCount": 3,
      "comparisonItems": {
        "left": "Mavi Işık Fotonunun Enerjisi",
        "right": "Kırmızı Işık Fotonunun Enerjisi"
      },
      "options": [
        "<",
        "=",
        ">"
      ],
      "correctIndex": 2,
      "shuffleOptions": false
    }
  },
  {
    "id": "q_lgs_033",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Üslü İfadeler ve Bilimsel Gösterim",
    "type": "numpad_closest",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "2⁵ · 5³ işleminin sonucu kaçtır?",
    "explanation": "2⁵ = 32 ve 5³ = 125'tir. 32 · 125 = 4000 (veya 2² · (2·5)³ = 4 · 10³ = 4000) bulunur.",
    "payload": {
      "correctAnswer": 4000,
      "unit": "",
      "allowDecimals": false,
      "allowNegative": false,
      "min": 0,
      "max": 10000
    }
  },
  {
    "id": "q_lgs_034",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Karekök Tahmini",
    "type": "slider",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "√150 sayısı sayı doğrusunda hangi ondalıklı değere en yakındır? Sürgüyü ayarlayın.",
    "explanation": "12² = 144 ve 13² = 169'dur. 150 sayısı 144'e çok daha yakın olduğundan √150 ≈ 12.24'tür (yaklaşık 12.2).",
    "payload": {
      "min": 10,
      "max": 15,
      "step": 0.1,
      "initialValue": 10,
      "unit": "",
      "targetValue": 12.2,
      "tolerance": 0.3
    }
  },
  {
    "id": "q_lgs_035",
    "examType": "LGS",
    "subject": "fizik",
    "topic": "Basınç (Katı ve Sıvı Basıncı)",
    "type": "matrix_toggle",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 120,
    "prompt": "Katı ve sıvı basıncı özelliklerini tablodaki hücrelere dokunarak (✓ / ✗) doldurun:",
    "explanation": "Katı basıncı yüzey alanı arttıkça azalır (ters orantı). Sıvı basıncı ise sıvının yoğunluğu ve derinliği arttıkça artar (P = h·d·g).",
    "payload": {
      "tablePrompt": "Her hücreyi ✓ (Doğru) veya ✗ (Yanlış) olarak işaretleyin:",
      "rows": [
        {
          "id": "r_kati",
          "title": "Katı Basıncı"
        },
        {
          "id": "r_sivi",
          "title": "Sıvı Basıncı"
        }
      ],
      "columns": [
        {
          "id": "c_alan",
          "title": "Yüzey Alanı Büyürse Azalır"
        },
        {
          "id": "c_derinlik",
          "title": "Derinlik Arttıkça Artar"
        }
      ],
      "answers": [
        {
          "rowId": "r_kati",
          "colId": "c_alan",
          "expectedBool": true
        },
        {
          "rowId": "r_kati",
          "colId": "c_derinlik",
          "expectedBool": false
        },
        {
          "rowId": "r_sivi",
          "colId": "c_alan",
          "expectedBool": false
        },
        {
          "rowId": "r_sivi",
          "colId": "c_derinlik",
          "expectedBool": true
        }
      ]
    }
  },
  {
    "id": "q_lgs_036",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Asitler, Bazlar ve pH Ölçeği",
    "type": "swipe_grouping",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Günlük hayattaki maddeleri Asit (pH < 7) ve Baz (pH > 7) özelliklerine göre kaydırarak gruplayın:",
    "explanation": "Limon suyu ve sirke asidiktir (pH < 7). Sabunlu su ve çamaşır suyu baziktir (pH > 7).",
    "payload": {
      "leftCategory": {
        "id": "left",
        "label": "⬅️ Asit (pH < 7)",
        "colorHex": "#EF4444"
      },
      "rightCategory": {
        "id": "right",
        "label": "Baz (pH > 7) ➡️",
        "colorHex": "#3B82F6"
      },
      "cards": [
        {
          "id": "c1",
          "text": "Limon Suyu",
          "correctCategory": "left"
        },
        {
          "id": "c2",
          "text": "Sabunlu Su",
          "correctCategory": "right"
        },
        {
          "id": "c3",
          "text": "Sirke",
          "correctCategory": "left"
        },
        {
          "id": "c4",
          "text": "Çamaşır Suyu",
          "correctCategory": "right"
        }
      ]
    }
  },
  {
    "id": "q_lgs_037",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA ve Genetik Kod",
    "type": "ordering_and_formula",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 120,
    "prompt": "Kalıtsal yapıları basitten karmaşığa (küçükten büyüğe) doğru sıralayın:",
    "explanation": "Kalıtsal yapılar küçükten büyüğe: Organik Baz -> Nükleotid -> Gen -> DNA -> Kromozom (KediGen kuralı).",
    "payload": {
      "mode": "sequence",
      "directionLabel": "Basitten Karmaşığa (Küçükten Büyüğe)",
      "items": [
        "Kromozom",
        "Gen",
        "Organik Baz",
        "DNA",
        "Nükleotid"
      ],
      "correctOrder": [
        "Organik Baz",
        "Nükleotid",
        "Gen",
        "DNA",
        "Kromozom"
      ]
    }
  },
  {
    "id": "q_lgs_038",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "Mevsimlerin Oluşumu ve İklim",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "21 Haziran tarihinde Güneş ışınları Yengeç Dönencesi'ne dik gelir. Bu tarihte Kuzey Yarım Küre'de hangi mevsim başlar?",
    "explanation": "21 Haziran Kuzey Yarım Küre için yaz gündönümüdür ve en uzun gündüz yaşanarak yaz mevsimi başlar.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "İlkbahar",
        "Yaz",
        "Sonbahar",
        "Kış"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "q_lgs_039",
    "examType": "LGS",
    "subject": "turkce",
    "topic": "Fiilimsiler (Eylemsiler)",
    "type": "pair_matching",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 150,
    "prompt": "Sol sütundaki altı çizili sözcükleri sağ sütundaki fiilimsi türleriyle eşleştirin.",
    "explanation": "Kitap okumayı -> İsim-fiil (-ma), Yıkılası dünya -> Sıfat-fiil (-ası), Güneş doğarken -> Zarf-fiil (-ken).",
    "payload": {
      "leftColumnTitle": "Cümle / İfade",
      "rightColumnTitle": "Fiilimsi Türü",
      "pairs": [
        {
          "pairId": "f_1",
          "leftText": "Kitap okumayı çok seviyor",
          "rightText": "İsim-fiil (-ma)"
        },
        {
          "pairId": "f_2",
          "leftText": "Yıkılası dünyada gülmedi",
          "rightText": "Sıfat-fiil (-ası)"
        },
        {
          "pairId": "f_3",
          "leftText": "Güneş doğarken yola çıktık",
          "rightText": "Zarf-fiil (-ken)"
        }
      ]
    }
  },
  {
    "id": "q_lgs_040",
    "examType": "LGS",
    "subject": "matematik",
    "topic": "Doğrusal Denklemler ve Eğim",
    "type": "chain_conversion",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 160,
    "prompt": "2y - 6x = 12 doğrusunun denklemini adım adım sadeleştirerek doğrunun eğimini bulun:",
    "explanation": "2y = 6x + 12 eşitliğinde her iki taraf 2'ye bölünürse y = 3x + 6 elde edilir. Doğru denkleminde y yalnızken x'in katsayısı eğim olduğundan m = 3'tür.",
    "payload": {
      "startEntity": "2y - 6x = 12 Denklemi",
      "steps": [
        {
          "stepNumber": 1,
          "arrowLabel": "y'yi yalnız bırak (2'ye böl)",
          "correctValue": "y = 3x + 6"
        },
        {
          "stepNumber": 2,
          "arrowLabel": "x'in katsayısı (Eğim m)",
          "correctValue": "m = 3"
        }
      ],
      "poolOptions": [
        "y = 3x + 6",
        "m = 3",
        "y = -3x + 6",
        "m = -3",
        "m = 6"
      ]
    }
  },
  {
    "id": "q_lgs_041",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Atatürk İlkeleri ve İnkılaplar",
    "type": "pair_matching",
    "difficulty": "orta",
    "timeLimitSeconds": 25,
    "points": 150,
    "prompt": "Verilen inkılap ve gelişmeleri doğrudan ilişkili olduğu Atatürk İlkesi ile eşleştirin.",
    "explanation": "TBMM'nin açılması -> Cumhuriyetçilik, Türk Dil Kurumu -> Milliyetçilik, Medreselerin kapatılması -> Laiklik ile doğrudan ilgilidir.",
    "payload": {
      "leftColumnTitle": "İnkılap / Gelişme",
      "rightColumnTitle": "Atatürk İlkesi",
      "pairs": [
        {
          "pairId": "s_1",
          "leftText": "TBMM'nin Açılması ve Saltanatın Kaldırılması",
          "rightText": "Cumhuriyetçilik"
        },
        {
          "pairId": "s_2",
          "leftText": "Türk Dil ve Türk Tarih Kurumunun Kurulması",
          "rightText": "Milliyetçilik"
        },
        {
          "pairId": "s_3",
          "leftText": "Medreselerin ve Tekke-Zaviyelerin Kapatılması",
          "rightText": "Laiklik"
        }
      ]
    }
  },
  {
    "id": "q_lgs_042",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Millî Mücadele Hazırlık Dönemi Kronolojisi",
    "type": "ordering_and_formula",
    "difficulty": "orta",
    "timeLimitSeconds": 20,
    "points": 130,
    "prompt": "Kurtuluş Savaşı hazırlık dönemindeki tarihi olayları kronolojik sıraya (eskiden yeniye) dizin:",
    "explanation": "Kronolojik sıra: Samsun'a Çıkış (19 Mayıs 1919) -> Amasya Genelgesi -> Erzurum Kongresi -> Sivas Kongresi -> TBMM'nin Açılışı.",
    "payload": {
      "mode": "sequence",
      "directionLabel": "Kronolojik Sıra (Geçmişten Günümüze)",
      "items": [
        "TBMM'nin Ankara'da Açılması",
        "Amasya Genelgesi",
        "Mustafa Kemal'in Samsun'a Çıkışı",
        "Sivas Kongresi",
        "Erzurum Kongresi"
      ],
      "correctOrder": [
        "Mustafa Kemal'in Samsun'a Çıkışı",
        "Amasya Genelgesi",
        "Erzurum Kongresi",
        "Sivas Kongresi",
        "TBMM'nin Ankara'da Açılması"
      ]
    }
  },
  {
    "id": "q_lgs_043",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "I. Dünya Savaşı İttifak ve İtilaf Blokları",
    "type": "swipe_grouping",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "I. Dünya Savaşı'ndaki devletleri İtilaf (Anlaşma) ve İttifak (Bağlaşma) bloklarına göre kaydırarak gruplayın:",
    "explanation": "İtilaf Devletleri: İngiltere, Fransa. İttifak Devletleri: Osmanlı Devleti, Almanya.",
    "payload": {
      "leftCategory": {
        "id": "left",
        "label": "⬅️ İtilaf (Anlaşma)",
        "colorHex": "#3B82F6"
      },
      "rightCategory": {
        "id": "right",
        "label": "İttifak (Bağlaşma) ➡️",
        "colorHex": "#EF4444"
      },
      "cards": [
        {
          "id": "c1",
          "text": "İngiltere",
          "correctCategory": "left"
        },
        {
          "id": "c2",
          "text": "Osmanlı Devleti",
          "correctCategory": "right"
        },
        {
          "id": "c3",
          "text": "Fransa",
          "correctCategory": "left"
        },
        {
          "id": "c4",
          "text": "Almanya",
          "correctCategory": "right"
        }
      ]
    }
  },
  {
    "id": "q_lgs_044",
    "examType": "LGS",
    "subject": "sosyal",
    "topic": "Millî Mücadele Genelgeleri",
    "type": "universal_choice",
    "difficulty": "kolay",
    "timeLimitSeconds": 15,
    "points": 80,
    "prompt": "\"Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.\" ilkesi Kurtuluş Savaşı'nın amacı ve yöntemi olarak ilk kez hangi tarihî belgede ilan edilmiştir?",
    "explanation": "22 Haziran 1919 tarihli Amasya Genelgesi'nde bu karar alınarak millî egemenlik ve ihtilal vurgulanmıştır.",
    "payload": {
      "variant": "test",
      "optionCount": 4,
      "options": [
        "Havza Genelgesi",
        "Amasya Genelgesi",
        "Erzurum Kongresi",
        "Misak-ı Millî Kararları"
      ],
      "correctIndex": 1,
      "shuffleOptions": false
    }
  },
  {
    "id": "q_lgs_045",
    "examType": "LGS",
    "subject": "biyoloji",
    "topic": "DNA ve Nükleotid Eşleşmesi",
    "type": "pair_matching",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 110,
    "prompt": "DNA molekülündeki nükleotid bazlarını ve temel bileşenlerini doğru eşleşmeleriyle birleştirin:",
    "explanation": "DNA'da Adenin karşısına Timin, Guanin karşısına Sitozin gelir. Deoksiriboz 5 karbonlu şekerdir.",
    "payload": {
      "leftColumnTitle": "DNA Bileşeni",
      "rightColumnTitle": "Eşleşen Karşılık",
      "pairs": [
        {
          "pairId": "dna_1",
          "leftText": "Adenin (A) bazı",
          "rightText": "Timin (T) bazı"
        },
        {
          "pairId": "dna_2",
          "leftText": "Guanin (G) bazı",
          "rightText": "Sitozin (C) bazı"
        },
        {
          "pairId": "dna_3",
          "leftText": "Deoksiriboz",
          "rightText": "5 Karbonlu Şeker"
        }
      ]
    }
  },
  {
    "id": "q_lgs_046",
    "examType": "LGS",
    "subject": "kimya",
    "topic": "Fiziksel ve Kimyasal Değişimler",
    "type": "swipe_grouping",
    "difficulty": "kolay",
    "timeLimitSeconds": 20,
    "points": 100,
    "prompt": "Günlük hayattaki olayları Fiziksel Değişim ve Kimyasal Değişim olarak kaydırarak gruplayın:",
    "explanation": "Buzun erimesi ve şekerin çözünmesi fizikseldir (iç yapı değişmez). Demirin paslanması ve sütün mayalanması kimyasaldır.",
    "payload": {
      "leftCategory": {
        "id": "left",
        "label": "⬅️ Fiziksel Değişim",
        "colorHex": "#10B981"
      },
      "rightCategory": {
        "id": "right",
        "label": "Kimyasal Değişim ➡️",
        "colorHex": "#F59E0B"
      },
      "cards": [
        {
          "id": "fc1",
          "text": "Buzun erimesi",
          "correctCategory": "left"
        },
        {
          "id": "fc2",
          "text": "Demirin paslanması",
          "correctCategory": "right"
        },
        {
          "id": "fc3",
          "text": "Şekerin suda çözünmesi",
          "correctCategory": "left"
        },
        {
          "id": "fc4",
          "text": "Sütten yoğurt yapılması",
          "correctCategory": "right"
        }
      ]
    }
  }
] as Question[];

export interface QuestionFilterOptions {
  examType?: 'LGS' | 'TYT' | 'AYT' | 'KARMA' | string;
  subjects?: string[];
  difficultyMode?: 'adaptive' | 'easy' | 'medium' | 'hard' | string;
  count?: number;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Kullanıcının seçtiği sınav, ders/branş ve zorluk filtrelerine %100 sadık kalarak soru seçer.
 * Asla seçilmeyen bir ders veya sınav kategorisinden soru sızdırmaz.
 */
export function filterAppQuestions(options: QuestionFilterOptions): Question[] {
  const normExam = (options.examType || 'TYT').toUpperCase();
  const subjects = (options.subjects && options.subjects.length > 0 ? options.subjects : ['matematik']).map((s) => s.toLowerCase());
  const diffMode = options.difficultyMode || 'adaptive';
  const targetCount = options.count && options.count > 0 ? options.count : 5;

  // 1. İstenen sınav ve branşa ait tüm sorular
  const matchingExamAndSubject = ALL_QUESTIONS.filter((q) => {
    const qExam = (q.examType || 'TYT').toUpperCase();
    const examOk = normExam === 'KARMA' || qExam === normExam;
    const subjOk = subjects.includes((q.subject || '').toLowerCase());
    return examOk && subjOk;
  });

  // 2. Zorluk önceliğine göre sırala
  let primaryPool: Question[] = [];
  if (diffMode === 'easy') {
    const easy = matchingExamAndSubject.filter((q) => q.difficulty === 'kolay');
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta');
    primaryPool = [...shuffle(easy), ...shuffle(medium)];
  } else if (diffMode === 'medium') {
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta');
    const easy = matchingExamAndSubject.filter((q) => q.difficulty === 'kolay');
    const hard = matchingExamAndSubject.filter((q) => q.difficulty === 'zor');
    primaryPool = [...shuffle(medium), ...shuffle(easy), ...shuffle(hard)];
  } else if (diffMode === 'hard') {
    const hard = matchingExamAndSubject.filter((q) => q.difficulty === 'zor');
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta');
    primaryPool = [...shuffle(hard), ...shuffle(medium)];
  } else {
    primaryPool = shuffle(matchingExamAndSubject);
  }

  const selected: Question[] = [];
  const usedIds = new Set<string>();

  for (const q of primaryPool) {
    if (selected.length >= targetCount) break;
    if (!usedIds.has(q.id)) {
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // 3. Fallback 1: Aynı sınav ve seçili branş havuzundan kalanları ekle
  if (selected.length < targetCount) {
    for (const q of shuffle(matchingExamAndSubject)) {
      if (selected.length >= targetCount) break;
      if (!usedIds.has(q.id)) {
        selected.push(q);
        usedIds.add(q.id);
      }
    }
  }

  // 4. Fallback 2: Seçilen branşı ASLA değiştirmeden diğer sınavlardan aynı branş sorularını ekle
  if (selected.length < targetCount) {
    const sameSubjectOtherExams = ALL_QUESTIONS.filter(
      (q) => subjects.includes((q.subject || '').toLowerCase()) && !usedIds.has(q.id)
    );
    for (const q of shuffle(sameSubjectOtherExams)) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // 5. Fallback 3: Aynı branşta tekil soru tükendiyse döngüsel olarak aynı branştan tamamla
  if (selected.length < targetCount) {
    const cycleSubject = ALL_QUESTIONS.filter((q) => subjects.includes((q.subject || '').toLowerCase()));
    if (cycleSubject.length > 0) {
      while (selected.length < targetCount) {
        for (const q of shuffle(cycleSubject)) {
          if (selected.length >= targetCount) break;
          selected.push({ ...q, id: `${q.id}_rep_${selected.length}` });
        }
      }
    }
  }

  return selected.slice(0, targetCount);
}
