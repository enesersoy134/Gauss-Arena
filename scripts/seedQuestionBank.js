const fs = require('node:fs');
const path = require('node:path');

const baseDir = path.join(__dirname, '..', 'question-bank');

const templates = {
  tyt: {
    matematik: {
      EASY: [
        { subTopic: 'Birinci Dereceden Denklemler', text: '$$3x - 7 = 14$$ olduğuna göre $$x$$ kaçtır?', options: ['5', '6', '7', '8'], correctOptionIndex: 2 },
        { subTopic: 'Temel Kavramlar', text: 'Ardışık üç çift tam sayının toplamı $$42$$ olduğuna göre, bu sayıların en büyüğü kaçtır?', options: ['12', '14', '16', '18'], correctOptionIndex: 2 },
        { subTopic: 'Rasyonel Sayılar', text: '$$\\frac{3}{4} + \\frac{5}{8}$$ işleminin sonucu kaçtır?', options: ['$$\\frac{7}{8}$$', '$$\\frac{9}{8}$$', '$$\\frac{11}{8}$$', '$$\\frac{13}{8}$$'], correctOptionIndex: 2 },
        { subTopic: 'Üslü Sayılar', text: '$$2^5 + 2^5$$ işleminin sonucu aşağıdakilerden hangisine eşittir?', options: ['$$2^6$$', '$$2^{10}$$', '$$4^5$$', '$$2^7$$'], correctOptionIndex: 0 },
        { subTopic: 'Oran Orantı', text: '$$\\frac{a}{b} = \\frac{3}{5}$$ ve $$a + b = 40$$ olduğuna göre $$b - a$$ kaçtır?', options: ['8', '10', '12', '15'], correctOptionIndex: 1 },
        { subTopic: 'Yüzde Problemleri', text: '$$240$$ sayısının $$\\%25$$\'i kaçtır?', options: ['45', '50', '60', '75'], correctOptionIndex: 2 },
      ],
      MEDIUM: [
        { subTopic: 'Mutlak Değer', text: '$$|2x - 6| = 10$$ denklemini sağlayan $$x$$ değerlerinin çarpımı kaçtır?', options: ['-16', '-12', '6', '16'], correctOptionIndex: 0 },
        { subTopic: 'Köklü Sayılar', text: '$$\\sqrt{75} - \\sqrt{27} + \\sqrt{12}$$ işleminin sonucu kaçtır?', options: ['$$2\\sqrt{3}$$', '$$3\\sqrt{3}$$', '$$4\\sqrt{3}$$', '$$5\\sqrt{3}$$'], correctOptionIndex: 2 },
        { subTopic: 'Yaş Problemleri', text: 'Bir babanın yaşı oğlunun yaşının $$3$$ katıdır. $$6$$ yıl sonra yaşları toplamı $$60$$ olacağına göre oğul bugün kaç yaşındadır?', options: ['10', '12', '14', '15'], correctOptionIndex: 1 },
        { subTopic: 'Kümeler', text: '$$s(A) = 12$$, $$s(B) = 9$$ ve $$s(A \\cap B) = 4$$ olduğuna göre $$s(A \\cup B)$$ kaçtır?', options: ['15', '17', '19', '21'], correctOptionIndex: 1 },
        { subTopic: 'Fonksiyonlar', text: '$$f(x) = 4x - 5$$ olduğuna göre $$f(3) + f^{-1}(7)$$ toplamı kaçtır?', options: ['8', '10', '12', '14'], correctOptionIndex: 1 },
        { subTopic: 'Hız Problemleri', text: 'Aralarında $$360\\text{ km}$$ bulunan iki araç birbirine doğru $$50\\text{ km/s}$$ ve $$40\\text{ km/s}$$ hızlarla aynı anda hareket ederse kaç saat sonra karşılaşırlar?', options: ['3', '4', '5', '6'], correctOptionIndex: 1 },
      ],
      HARD: [
        { subTopic: 'Permütasyon - Kombinasyon', text: '$$6$$ doktor ve $$4$$ hemşire arasından içinde en az $$2$$ doktor bulunan $$3$$ kişilik bir sağlık ekibi kaç farklı şekilde seçilebilir?', options: ['60', '70', '80', '96'], correctOptionIndex: 2 },
        { subTopic: 'Olasılık', text: 'İki zar aynı anda atıldığında üst yüze gelen sayıların toplamının $$8$$ olma olasılığı kaçtır?', options: ['$$\\frac{1}{9}$$', '$$\\frac{5}{36}$$', '$$\\frac{1}{6}$$', '$$\\frac{7}{36}$$'], correctOptionIndex: 1 },
        { subTopic: 'Polinomlar', text: '$$P(x) = x^3 - ax^2 + 4x - 6$$ polinomunun $$(x - 2)$$ ile bölümünden kalan $$2$$ olduğuna göre $$a$$ kaçtır?', options: ['1', '2', '3', '4'], correctOptionIndex: 1 },
        { subTopic: 'Çarpanlara Ayırma', text: '$$x - y = 5$$ ve $$x \\cdot y = 6$$ olduğuna göre $$x^2 + y^2$$ ifadesinin değeri kaçtır?', options: ['31', '35', '37', '41'], correctOptionIndex: 2 },
        { subTopic: 'Bölünebilme Kuralları', text: 'Dört basamaklı $$4a5b$$ sayısı $$15$$ ile tam bölünebildiğine göre $$a$$\'nın alabileceği en büyük değer kaçtır?', options: ['6', '7', '8', '9'], correctOptionIndex: 3 },
        { subTopic: 'Karışım Problemleri', text: 'Tuz oranı $$\\%20$$ olan $$40\\text{ litre}$$ tuzlu suya $$10\\text{ litre}$$ saf tuz eklenirse yeni karışımın tuz oranı yüzde kaç olur?', options: ['32', '36', '40', '44'], correctOptionIndex: 1 },
      ],
    },
    fizik: {
      EASY: [
        { subTopic: 'Fizik Bilimine Giriş', text: 'Aşağıdakilerden hangisi SI birim sisteminde temel bir büyüklüktür?', options: ['Kuvvet', 'Hız', 'Kütle', 'Enerji'], correctOptionIndex: 2 },
        { subTopic: 'Madde ve Özellikleri', text: 'Kütlesi $$120\\text{ g}$$, hacmi $$40\\text{ cm}^3$$ olan türdeş bir maddenin özkütlesi kaç $$\\text{g/cm}^3$$\'tür?', options: ['2', '3', '4', '5'], correctOptionIndex: 1 },
        { subTopic: 'Isı ve Sıcaklık', text: 'Saf suyun deniz seviyesinde donma sıcaklığı Kelvin ölçeğinde kaç $$\\text{K}$$ değerine karşılık gelir?', options: ['0', '100', '273', '373'], correctOptionIndex: 2 },
        { subTopic: 'Kuvvet ve Hareket', text: 'Sürtünmesiz yatay düzlemde duran $$4\\text{ kg}$$ kütleli cisme $$20\\text{ N}$$ yatay kuvvet uygulanırsa ivmesi kaç $$\\text{m/s}^2$$ olur?', options: ['4', '5', '6', '8'], correctOptionIndex: 1 },
        { subTopic: 'İş Güç Enerji', text: 'Yatay sürtünmesiz yolda $$15\\text{ N}$$ kuvvetle $$6\\text{ m}$$ çekilen cisim üzerinde yapılan iş kaç $$\\text{Joule}$$ olur?', options: ['60', '75', '90', '105'], correctOptionIndex: 2 },
        { subTopic: 'Elektrik Akımı', text: 'Direnci $$6\\,\\Omega$$ olan bir iletkenden $$3\\text{ A}$$ akım geçtiğine göre uçları arasındaki potansiyel fark kaç $$\\text{Volt}$$ olur?', options: ['9', '12', '18', '24'], correctOptionIndex: 2 },
      ],
      MEDIUM: [
        { subTopic: 'Doğrusal Hareket', text: 'Durgun halden harekete geçen bir araç $$4\\text{ m/s}^2$$ sabit ivme ile $$5\\text{ saniye}$$ boyunca hızlanıyor. Bu süre sonunda aracın aldığı toplam yol kaç metredir?', options: ['20', '40', '50', '100'], correctOptionIndex: 2 },
        { subTopic: 'Basınç', text: 'Özkütlesi $$2\\text{ g/cm}^3$$ olan sıvının $$5\\text{ m}$$ derinliğinde oluşturduğu sıvı basıncı kaç $$\\text{kPa}$$ olur? ($$g = 10\\text{ m/s}^2$$)', options: ['50', '80', '100', '120'], correctOptionIndex: 2 },
        { subTopic: 'Kaldırma Kuvveti', text: 'Hacmi $$400\\text{ cm}^3$$ olan bir cisim özkütlesi $$1\\text{ g/cm}^3$$ olan suya tamamen daldırıldığında cisme etki eden kaldırma kuvveti kaç $$\\text{N}$$ olur? ($$g = 10\\text{ m/s}^2$$)', options: ['2', '4', '6', '8'], correctOptionIndex: 1 },
        { subTopic: 'Enerji Korunumu', text: 'Yerden $$20\\text{ m}$$ yükseklikten serbest bırakılan bir cisim yere kaç $$\\text{m/s}$$ hızla çarpar? ($$g = 10\\text{ m/s}^2$$, sürtünmeler önemsiz)', options: ['10', '15', '20', '25'], correctOptionIndex: 2 },
        { subTopic: 'Elektrik Devreleri', text: 'Birbirine paralel bağlı $$6\\,\\Omega$$ ve $$3\\,\\Omega$$\'luk iki direncin eşdeğer direnci kaç $$\\Omega$$\'dur?', options: ['1', '2', '3', '9'], correctOptionIndex: 1 },
        { subTopic: 'Dalgalar', text: 'Yayılma hızı $$20\\text{ m/s}$$ ve frekansı $$4\\text{ Hz}$$ olan periyodik bir dalganın dalga boyu kaç metredir?', options: ['4', '5', '8', '10'], correctOptionIndex: 1 },
      ],
      HARD: [
        { subTopic: 'Optik - Kırılma', text: 'Kırıcılık indisi $$n_1 = 2$$ olan ortamdan $$n_2 = 1$$ olan ortama geçen ışın için sınır açısı kaç derecedir?', options: ['30', '37', '45', '60'], correctOptionIndex: 0 },
        { subTopic: 'Sürtünmeli Hareket', text: 'Yatay düzlemde $$5\\text{ kg}$$ kütleli cisme $$30\\text{ N}$$ yatay kuvvet uygulanıyor. Sürtünme katsayısı $$k = 0.2$$ olduğuna göre cismin ivmesi kaç $$\\text{m/s}^2$$\'dir? ($$g = 10\\text{ m/s}^2$$)', options: ['2', '3', '4', '5'], correctOptionIndex: 2 },
        { subTopic: 'Isı Alışverişi', text: '$$20^\\circ\\text{C}$$\'deki $$100\\text{ g}$$ su ile $$80^\\circ\\text{C}$$\'deki $$300\\text{ g}$$ su karıştırılırsa denge sıcaklığı kaç $$^\\circ\\text{C}$$ olur?', options: ['50', '60', '65', '70'], correctOptionIndex: 2 },
        { subTopic: 'Elektriksel Güç', text: 'İç direnci önemsiz $$24\\text{ V}$$ üretece bağlı $$8\\,\\Omega$$ dirençte $$10\\text{ saniye}$$de açığa çıkan ısı enerjisi kaç $$\\text{Joule}$$ olur?', options: ['360', '480', '720', '960'], correctOptionIndex: 2 },
        { subTopic: 'Küresel Aynalar', text: 'Odak uzaklığı $$f = 12\\text{ cm}$$ olan çukur aynanın önüne $$24\\text{ cm}$$ uzağa konulan cismin görüntüsü aynadan kaç $$\\text{cm}$$ uzakta oluşur?', options: ['12', '18', '24', '36'], correctOptionIndex: 2 },
        { subTopic: 'Basınç ve Kaldırma', text: 'Özkütlesi $$0.6\\text{ g/cm}^3$$ olan katı bir cisim su ($$d = 1\\text{ g/cm}^3$$) içinde yüzerken hacminin yüzde kaçı suyun dışında kalır?', options: ['20', '30', '40', '60'], correctOptionIndex: 2 },
      ],
    },
    kimya: {
      EASY: [
        { subTopic: 'Kimya Bilimi', text: 'Periyodik tabloda $$\text{Na}$$ sembolü ile gösterilen element aşağıdakilerden hangisidir?', options: ['Azot', 'Sodyum', 'Potasyum', 'Nikel'], correctOptionIndex: 1 },
        { subTopic: 'Atom ve Periyodik Sistem', text: 'Proton sayısı $$17$$, nötron sayısı $$18$$ olan klor atomunun kütle numarası kaçtır?', options: ['17', '18', '34', '35'], correctOptionIndex: 3 },
        { subTopic: 'Maddenin Halleri', text: 'Maddenin katı halden doğrudan gaz haline geçmesi olayına ne ad verilir?', options: ['Erime', 'Kırağılaşma', 'Süblimleşme', 'Yoğuşma'], correctOptionIndex: 2 },
        { subTopic: 'Asitler ve Bazlar', text: 'Oda koşullarında sulu çözeltisinin $$\\text{pH}$$ değeri $$7$$\'den küçük olan maddeler için aşağıdakilerden hangisi doğrudur?', options: ['Baziktir', 'Asidiktir', 'Nötrdür', 'Mavi turnusolu değiştirmez'], correctOptionIndex: 1 },
        { subTopic: 'Kimyasal Türler', text: '$$\text{H}_2\text{O}$$ molekülünde hidrojen ve oksijen atomları arasındaki güçlü etkileşim türü hangisidir?', options: ['İyonik bağ', 'Polar kovalent bağ', 'Apolar kovalent bağ', 'Metalik bağ'], correctOptionIndex: 1 },
        { subTopic: 'Karışımlar', text: 'Aşağıdakilerden hangisi homojen bir karışıma (çözeltiye) örnektir?', options: ['Ayran', 'Sis', 'Tuzlu su', 'Zeytinyağlı su'], correctOptionIndex: 2 },
      ],
      MEDIUM: [
        { subTopic: 'Periyodik Özellikler', text: 'Periyodik sistemde aynı periyotta soldan sağa doğru gidildikçe atom yarıçapı ve birinci iyonlaşma enerjisi genel olarak nasıl değişir?', options: ['Artar - Artar', 'Azalır - Artar', 'Azalır - Azalır', 'Artar - Azalır'], correctOptionIndex: 1 },
        { subTopic: 'Mol Kavramı', text: 'Normal koşullarda (NK) $$11.2\\text{ litre}$$ hacim kaplayan $$\text{CH}_4$$ gazı kaç gramdır? ($$\text{C}=12, \text{H}=1$$)', options: ['4', '8', '12', '16'], correctOptionIndex: 1 },
        { subTopic: 'Kimyasal Hesaplamalar', text: '$$0.5\\text{ mol } \text{C}_3\text{H}_8$$ gazı tamamen yakıldığında kaç mol $$\text{CO}_2$$ gazı oluşur?', options: ['1', '1.5', '2', '3'], correctOptionIndex: 1 },
        { subTopic: 'Çözelti Derişimleri', text: '$$160\\text{ g}$$ suda $$40\\text{ g}$$ şeker çözünerek hazırlanan çözeltinin kütlece yüzde derişimi kaçtır?', options: ['15', '20', '25', '30'], correctOptionIndex: 1 },
        { subTopic: 'Zayıf Etkileşimler', text: 'Aşağıdaki moleküllerden hangisinin yoğun fazlarında moleküller arasında hidrojen bağı görülür?', options: ['$$\text{CH}_4$$', '$$\text{HCl}$$', '$$\text{NH}_3$$', '$$\text{CO}_2$$'], correctOptionIndex: 2 },
        { subTopic: 'Atomun Yapısı', text: '$$^{24}_{12}\text{Mg}^{2+}$$ iyonunun elektron sayısı kaçtır?', options: ['10', '12', '14', '24'], correctOptionIndex: 0 },
      ],
      HARD: [
        { subTopic: 'Sınırlayıcı Bileşen', text: '$$4\\text{ mol } \text{N}_2$$ ve $$6\\text{ mol } \text{H}_2$$ gazları $$\text{N}_2 + 3\text{H}_2 \\rightarrow 2\text{NH}_3$$ denklemine göre tam verimle tepkimeye girdiğinde kaç mol $$\text{NH}_3$$ oluşur?', options: ['2', '3', '4', '6'], correctOptionIndex: 2 },
        { subTopic: 'Koligatif Özellikler', text: 'Uçucu olmayan bir katının saf suda çözünmesiyle oluşan çözeltinin 1 atm basınçta kaynamaya başlama sıcaklığı ve donmaya başlama sıcaklığı saf suya göre nasıl değişir?', options: ['Yükselir - Düşer', 'Düşer - Yükselir', 'Yükselir - Yükselir', 'Düşer - Düşer'], correctOptionIndex: 0 },
        { subTopic: 'Sabit Oranlar Yasası', text: '$$\text{Fe}_2\text{O}_3$$ bileşiğinde kütlece birleşme oranı $$\frac{m_{\text{Fe}}}{m_{\text{O}}} = \frac{7}{3}$$ olduğuna göre $$21\\text{ g Fe}$$ ile yeterince oksijenin tepkimesinden kaç gram $$\text{Fe}_2\text{O}_3$$ oluşur?', options: ['24', '27', '30', '35'], correctOptionIndex: 2 },
        { subTopic: 'Asit Baz Tepkimeleri', text: '$$2\\text{ mol } \text{H}_2\text{SO}_4$$ içeren sulu çözeltiyi tam nötralleştirmek için kaç mol $$\text{NaOH}$$ gerekir?', options: ['1', '2', '3', '4'], correctOptionIndex: 3 },
        { subTopic: 'İzotop Atomlar', text: 'Doğada $$^{35}\text{Cl}$$ izotopu $$\\%75$$, $$^{37}\text{Cl}$$ izotopu $$\\%25$$ oranında bulunduğuna göre klorun ortalama atom kütlesi kaç akb\'dir?', options: ['35.2', '35.5', '36.0', '36.5'], correctOptionIndex: 1 },
        { subTopic: 'Yüzde Verim', text: '$$\text{CaCO}_3(k) \\rightarrow \text{CaO}(k) + \text{CO}_2(g)$$ tepkimesine göre $$200\\text{ g } \text{CaCO}_3$$ $$\\%50$$ verimle ayrıştığında kaç mol $$\text{CO}_2$$ oluşur? ($$\text{CaCO}_3 = 100\\text{ g/mol}$$)', options: ['0.5', '1', '1.5', '2'], correctOptionIndex: 1 },
      ],
    },
    turkce: {
      EASY: [
        { subTopic: 'Sözcükte Anlam', text: '"Keskin" sözcüğü aşağıdaki cümlelerin hangisinde mecaz anlamda kullanılmıştır?', options: ['Bıçağın keskin tarafına dikkat et.', 'Keskin bir zekâya sahip olduğu hemen anlaşılıyordu.', 'Camın keskin kenarı elini çizdi.', 'Baltanın ağzı oldukça keskindi.'], correctOptionIndex: 1 },
        { subTopic: 'Yazım Kuralları', text: 'Aşağıdaki cümlelerin hangisinde "de / da" bağlacının yazımıyla ilgili bir yanlışlık yapılmıştır?', options: ['Sen de bizimle sinemaya gelecek misin?', 'Kitabımı okulda unutmuşum.', 'Bu soruyu Ahmet\'te doğru çözmüş.', 'Toplantıda önemli kararlar alındı.'], correctOptionIndex: 2 },
        { subTopic: 'Noktalama İşaretleri', text: 'Tamamlanmış cümlelerin sonuna aşağıdaki noktalama işaretlerinden hangisi konur?', options: ['Virgül', 'Noktalı virgül', 'Nokta', 'İki nokta'], correctOptionIndex: 2 },
        { subTopic: 'Cümlede Anlam', text: 'Aşağıdaki cümlelerin hangisinde "neden-sonuç" ilişkisi vardır?', options: ['Sınavı kazanmak için gece gündüz çalıştı.', 'Yağmur şiddetli yağdığından maç ertelendi.', 'Seni görmek üzere buraya geldim.', 'Başarılı olmak adına plan yaptı.'], correctOptionIndex: 1 },
        { subTopic: 'Sözcük Türleri', text: '"Hızlı tren istasyona zamanında ulaştı." cümlesinde "hızlı" sözcüğünün türü nedir?', options: ['İsim', 'Sıfat', 'Zarf', 'Zamir'], correctOptionIndex: 1 },
        { subTopic: 'Ses Bilgisi', text: 'Aşağıdaki sözcüklerin hangisinde ünlü düşmesi vardır?', options: ['Kitapçı', 'Ağzı', 'Güzellik', 'Yolculuk'], correctOptionIndex: 1 },
      ],
      MEDIUM: [
        { subTopic: 'Cümlenin Ögeleri', text: '"Genç yazar, son romanında çocukluk yıllarını içtenlikle anlatmış." cümlesinin nesnesi aşağıdakilerden hangisidir?', options: ['Genç yazar', 'son romanında', 'çocukluk yıllarını', 'içtenlikle'], correctOptionIndex: 2 },
        { subTopic: 'Fiilimsiler', text: 'Aşağıdaki cümlelerin hangisinde sıfat-fiil (ortaç) kullanılmıştır?', options: ['Koşarak yanımıza geldi.', 'Okunacak kitapları masaya ayırdım.', 'Gülüp geçmek bazen en iyisidir.', 'Eve varmadan beni ara.'], correctOptionIndex: 1 },
        { subTopic: 'Paragrafta Ana Düşünce', text: 'Bir yazarın eserinin kalıcı olmasını sağlayan temel unsur, kendi çağının sorunlarını anlatırken tüm insanlığın ortak duygularına dokunabilmesidir. Bu cümlede vurgulanan kavram hangisidir?', options: ['Özgünlük', 'Evrensellik', 'Akıcılık', 'Duruluk'], correctOptionIndex: 1 },
        { subTopic: 'Ses Olayları', text: '"Kayıp etti" birleşik fiili "kaybetti" şeklinde yazıldığında hangi iki ses olayı bir arada görülür?', options: ['Ünsüz türemesi - Ünlü daralması', 'Ünlü düşmesi - Ünsüz yumuşaması', 'Ünsüz benzeşmesi - Ünlü daralması', 'Ulama - Kaynaştırma'], correctOptionIndex: 1 },
        { subTopic: 'Anlatım Bozuklukları', text: '"Şüphesiz bu sınavı kesinlikle kazanabilir." cümlesindeki anlatım bozukluğunun nedeni nedir?', options: ['Özne-yüklem uyuşmazlığı', 'Çelişen sözcüklerin bir arada kullanılması', 'Gereksiz yardımcı fiil kullanımı', 'Tamlama yanlışlığı'], correctOptionIndex: 1 },
        { subTopic: 'Yapı Bilgisi', text: 'Aşağıdaki sözcüklerden hangisi hem yapım hem çekim eki almıştır?', options: ['Evler', 'Gözlükçü', 'Kitaplığımız', 'Yollar'], correctOptionIndex: 2 },
      ],
      HARD: [
        { subTopic: 'Cümle Türleri', text: '"Sanatçı, eserinde doğayı betimlerken okurun hayal gücüne de geniş bir alan bırakıyor." cümlesi yapıca nasıl bir cümledir?', options: ['Basit cümle', 'Girişik birleşik cümle', 'Sıralı cümle', 'Bağlı cümle'], correctOptionIndex: 1 },
        { subTopic: 'Fiilde Çatı', text: 'Aşağıdaki cümlelerin hangisinde yüklem edilgen çatılı bir fiildir?', options: ['Çocuklar bahçede neşeyle koşuşturdu.', 'Sınav sonuçları dün akşam açıklandı.', 'Annem lezzetli bir kek yaptı.', 'Kuşlar sıcak ülkelere göç etti.'], correctOptionIndex: 1 },
        { subTopic: 'Yazım Kuralları - Birleşik Sözcükler', text: 'Aşağıdaki birleşik sözcüklerden hangisinin yazımı yanlıştır?', options: ['Başvuru', 'Öngörü', 'Farketmek', 'Vazgeçmek'], correctOptionIndex: 2 },
        { subTopic: 'Karma Dil Bilgisi', text: '"Karanlık sokaklardan geçerken adımlarını hızlandırdı." cümlesinde aşağıdakilerden hangisi yoktur?', options: ['Niteleme sıfatı', 'Zarf-fiil', 'Belirtili isim tamlaması', 'Belirtme durum eki'], correctOptionIndex: 2 },
        { subTopic: 'Noktalama İşaretleri', text: 'Cümle içinde virgüllerle ayrılmış tür veya takımları birbirinden ayırmak için hangi noktalama işareti kullanılır?', options: ['İki nokta', 'Noktalı virgül', 'Kısa çizgi', 'Üç nokta'], correctOptionIndex: 1 },
        { subTopic: 'Sözcük Türleri - Zamirler', text: '"Bunu sana kim söylediyse doğruyu anlatmamış." cümlesinde kaç tane zamir (adıl) vardır?', options: ['1', '2', '3', '4'], correctOptionIndex: 2 },
      ],
    },
  },
  ayt: {
    matematik: {
      EASY: [
        { subTopic: 'İkinci Dereceden Denklemler', text: '$$x^2 - 7x + 12 = 0$$ denkleminin kökler toplamı kaçtır?', options: ['5', '7', '12', '-7'], correctOptionIndex: 1 },
        { subTopic: 'Logaritma', text: '$$\\log_2(32) + \\log_3(27)$$ işleminin sonucu kaçtır?', options: ['6', '7', '8', '9'], correctOptionIndex: 2 },
        { subTopic: 'Diziler', text: 'Genel terimi $$a_n = 3n + 2$$ olan bir dizinin ilk $$4$$ teriminin toplamı kaçtır?', options: ['34', '36', '38', '40'], correctOptionIndex: 2 },
        { subTopic: 'Trigonometri', text: '$$\\sin^2(35^\\circ) + \\cos^2(35^\\circ) + \\tan(45^\\circ)$$ işleminin sonucu kaçtır?', options: ['0', '1', '2', '3'], correctOptionIndex: 2 },
        { subTopic: 'Limit', text: '$$\\lim_{x \\to 3} (x^2 - 2x + 5)$$ limitinin değeri kaçtır?', options: ['6', '8', '10', '12'], correctOptionIndex: 1 },
        { subTopic: 'Türev Alma Kuralları', text: '$$f(x) = 4x^3 - 5x + 7$$ fonksiyonunun $$x = 1$$ noktasındaki türevi $$f\'(1)$$ kaçtır?', options: ['5', '7', '9', '12'], correctOptionIndex: 1 },
      ],
      MEDIUM: [
        { subTopic: 'Parabol', text: '$$f(x) = x^2 - 6x + 13$$ parabolünün tepe noktasının ordinatı ($$k$$ değeri) kaçtır?', options: ['2', '3', '4', '5'], correctOptionIndex: 2 },
        { subTopic: 'Logaritma Denklemleri', text: '$$\\log_3(x - 1) + \\log_3(x + 1) = 1$$ denklemini sağlayan pozitif $$x$$ değeri kaçtır?', options: ['$$\\sqrt{2}$$', '2', '$$\\sqrt{5}$$', '3'], correctOptionIndex: 1 },
        { subTopic: 'Geometrik Dizi', text: 'İlk terimi $$a_1 = 3$$ ve ortak çarpanı $$r = 2$$ olan pozitif terimli bir geometrik dizinin $$5.$$ terimi kaçtır?', options: ['24', '36', '48', '96'], correctOptionIndex: 2 },
        { subTopic: 'Trigonometrik Özdeşlikler', text: '$$0 < x < \\frac{\\pi}{2}$$ olmak üzere $$\\sin(x) = \\frac{3}{5}$$ ise $$\\sin(2x)$$ değeri kaçtır?', options: ['$$\\frac{12}{25}$$', '$$\\frac{18}{25}$$', '$$\\frac{24}{25}$$', '$$\\frac{4}{5}$$'], correctOptionIndex: 2 },
        { subTopic: 'Türev - Teğet Denklemi', text: '$$f(x) = x^2 + 3x - 1$$ eğrisine $$x = 2$$ apsisli noktasından çizilen teğetin eğimi kaçtır?', options: ['5', '6', '7', '9'], correctOptionIndex: 2 },
        { subTopic: 'Belirsiz İntegral', text: '$$f\'(x) = 6x^2 - 4x + 3$$ ve $$f(1) = 7$$ olduğuna göre $$f(2)$$ kaçtır?', options: ['14', '16', '18', '20'], correctOptionIndex: 2 },
      ],
      HARD: [
        { subTopic: 'Türev Uygulamaları', text: '$$f(x) = x^3 - 6x^2 + 9x + 2$$ fonksiyonunun yerel maksimum noktasının ordinatı ($$y$$ değeri) kaçtır?', options: ['2', '4', '6', '8'], correctOptionIndex: 2 },
        { subTopic: 'Belirli İntegral', text: '$$\\int_{0}^{2} (3x^2 - 2x + 1)\\,dx$$ belirli integralinin değeri kaçtır?', options: ['4', '6', '8', '10'], correctOptionIndex: 1, durationMs: 25000 },
        { subTopic: 'İntegralde Alan', text: '$$y = x^2$$ parabolü ile $$y = 4$$ doğrusu arasında kalan kapalı bölgenin alanı kaç birimkaredir?', options: ['$$\\frac{16}{3}$$', '$$\\frac{32}{3}$$', '12', '16'], correctOptionIndex: 1 },
        { subTopic: 'Limit ve Süreklilik', text: '$$\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$$ limitinin değeri kaçtır?', options: ['2', '3', '4', '6'], correctOptionIndex: 1 },
        { subTopic: 'Maksimum Minimum Problemleri', text: 'Toplamları $$20$$ olan iki pozitif gerçel sayının çarpımının alabileceği en büyük değer kaçtır?', options: ['64', '81', '96', '100'], correctOptionIndex: 3 },
        { subTopic: 'Karmaşık Sayılar', text: '$$i^2 = -1$$ olmak üzere $$(1 + i)^6$$ ifadesinin eşiti aşağıdakilerden hangisidir?', options: ['$$-8i$$', '$$8i$$', '$$-8$$', '$$8$$'], correctOptionIndex: 0 },
      ],
    },
    fizik: {
      EASY: [
        { subTopic: 'Vektörler', text: 'Aynı düzlemde aralarında $$90^\\circ$$ açı bulunan $$6\\text{ N}$$ ve $$8\\text{ N}$$ büyüklüğündeki iki kuvvetin bileşkesi kaç $$\\text{N}$$ olur?', options: ['10', '12', '14', '16'], correctOptionIndex: 0 },
        { subTopic: 'İtme ve Momentum', text: 'Kütlesi $$3\\text{ kg}$$ olan bir cisim $$8\\text{ m/s}$$ hızla hareket etmektedir. Cismin çizgisel momentumu kaç $$\\text{kg}\\cdot\\text{m/s}$$\'dir?', options: ['16', '24', '32', '48'], correctOptionIndex: 1 },
        { subTopic: 'Tork ve Denge', text: 'Dönme noktasına dik uzaklığı $$0.5\\text{ m}$$ olan noktaya uygulanan $$40\\text{ N}$$ kuvvetin oluşturduğu tork kaç $$\\text{N}\\cdot\\text{m}$$\'dir?', options: ['10', '20', '30', '40'], correctOptionIndex: 1 },
        { subTopic: 'Çembersel Hareket', text: 'Periyodu $$0.2\\text{ saniye}$$ olan düzgün çembersel hareket yapan bir cismin frekansı kaç $$\\text{s}^{-1}$$\'dir?', options: ['2', '4', '5', '10'], correctOptionIndex: 2 },
        { subTopic: 'Yay Enerjisi', text: 'Yay sabiti $$k = 200\\text{ N/m}$$ olan bir yay $$0.2\\text{ m}$$ sıkıştırıldığında yayda depolanan esneklik potansiyel enerjisi kaç $$\\text{Joule}$$ olur?', options: ['2', '4', '6', '8'], correctOptionIndex: 1 },
        { subTopic: 'Transformatörler', text: 'Giriş sarım sayısı $$100$$, çıkış sarım sayısı $$400$$ olan ideal bir transformatörün girişine $$50\\text{ V}$$ alternatif gerilim uygulanırsa çıkış gerilimi kaç $$\\text{V}$$ olur?', options: ['100', '150', '200', '250'], correctOptionIndex: 2 },
      ],
      MEDIUM: [
        { subTopic: 'Eğik Atış', text: 'Hava direncinin önemsiz olduğu ortamda düşey yukarı $$30\\text{ m/s}$$ hızla atılan bir cismin çıkabileceği maksimum yükseklik kaç metredir? ($$g = 10\\text{ m/s}^2$$)', options: ['30', '45', '60', '90'], correctOptionIndex: 1 },
        { subTopic: 'Esnek Olmayan Çarpışma', text: 'Sürtünmesiz yatay düzlemde $$10\\text{ m/s}$$ hızla giden $$2\\text{ kg}$$ kütleli cisim durmakta olan $$3\\text{ kg}$$ kütleli cisme çarparak kenetleniyor. Ortak kütlenin hızı kaç $$\\text{m/s}$$ olur?', options: ['2', '4', '5', '6'], correctOptionIndex: 1 },
        { subTopic: 'Merkezcil Kuvvet', text: 'Yarıçapı $$2\\text{ m}$$ olan yatay sürtünmesiz yörüngede $$6\\text{ m/s}$$ çizgisel hızla dolanan $$3\\text{ kg}$$ kütleli cisme etki eden merkezcil kuvvet kaç $$\\text{N}$$ olur?', options: ['27', '36', '54', '72'], correctOptionIndex: 2 },
        { subTopic: 'Basit Harmonik Hareket', text: 'Yay sabiti $$k = 100\\text{ N/m}$$ olan yayın ucuna $$4\\text{ kg}$$ kütleli cisim bağlanarak basit harmonik hareket yaptırılıyor. Hareketin periyodu kaç saniyedir? ($$\\pi = 3$$)', options: ['0.6', '1.2', '1.8', '2.4'], correctOptionIndex: 1 },
        { subTopic: 'Sığaçlar (Kondansatörler)', text: 'Sığası $$4\\text{ F}$$ olan bir kondansatör $$12\\text{ V}$$ gerilim altında yüklendiğinde depoladığı yük kaç $$\\text{Coulomb}$$ olur?', options: ['24', '36', '48', '60'], correctOptionIndex: 2 },
        { subTopic: 'Fotoelektrik Olay', text: 'Eşik enerjisi $$2.2\\text{ eV}$$ olan bir metale $$5.0\\text{ eV}$$ enerjili fotonlar düşürüldüğünde sökülen fotoelektronların maksimum kinetik enerjisi kaç $$\\text{eV}$$ olur?', options: ['1.8', '2.8', '3.2', '7.2'], correctOptionIndex: 1 },
      ],
      HARD: [
        { subTopic: 'Açısal Momentum', text: 'Eylemsizlik momenti $$I = 4\\text{ kg}\\cdot\\text{m}^2$$ olan bir disk $$\\omega = 5\\text{ rad/s}$$ açısal hızla dönerken açısal momentumu kaç $$\\text{kg}\\cdot\\text{m}^2/\\text{s}$$ olur?', options: ['15', '20', '25', '40'], correctOptionIndex: 1 },
        { subTopic: 'Manyetik Kuvvet', text: 'Büyüklüğü $$B = 4\\text{ T}$$ olan düzgün manyetik alana dik olarak yerleştirilen $$0.5\\text{ m}$$ uzunluğundaki telden $$3\\text{ A}$$ akım geçtiğinde tele etki eden manyetik kuvvet kaç $$\\text{N}$$ olur?', options: ['3', '6', '9', '12'], correctOptionIndex: 1 },
        { subTopic: 'İndüksiyon EMK', text: 'Bir çerçeveden geçen manyetik akı $$0.2\\text{ saniye}$$ içinde $$0.8\\text{ Weber}$$ değiştiğine göre oluşan ortalama indüksiyon elektromotor kuvveti kaç $$\\text{Volt}$$ olur?', options: ['2', '4', '6', '8'], correctOptionIndex: 1 },
        { subTopic: 'Kepler ve Kütle Çekim', text: 'Yeryüzünde ağırlığı $$360\\text{ N}$$ olan bir cismin, Dünya merkezinden $$3R$$ uzaklıktaki ($$R$$: Dünya yarıçapı) ağırlığı kaç $$\\text{N}$$ olur?', options: ['30', '40', '60', '90'], correctOptionIndex: 1 },
        { subTopic: 'De Broglie Dalga Boyu', text: 'Çizgisel momentumu $$p$$ olan bir parçacığın hızı iki katına çıkarılırsa De Broglie dalga boyu nasıl değişir?', options: ['İki katına çıkar', 'Yarıya iner', 'Dört katına çıkar', 'Değişmez'], correctOptionIndex: 1 },
        { subTopic: 'Eğik Düzlem Dinamiği', text: 'Eğik açısı $$37^\\circ$$ olan sürtünmesiz eğik düzlem üzerindeki $$5\\text{ kg}$$ kütleli cismin ivmesi kaç $$\\text{m/s}^2$$ olur? ($$\\sin 37^\\circ = 0.6, g = 10\\text{ m/s}^2$$)', options: ['4', '5', '6', '8'], correctOptionIndex: 2 },
      ],
    },
    kimya: {
      EASY: [
        { subTopic: 'Modern Atom Teorisi', text: 'Baş kuantum sayısı $$n = 3$$ olan enerji düzeyinde bulunan $$p$$ alt kabuğunda en fazla kaç elektron bulunabilir?', options: ['2', '6', '10', '14'], correctOptionIndex: 1 },
        { subTopic: 'Gazlar', text: 'Sabit sıcaklıkta ideal bir gazın hacmi yarıya indirilirse basıncı nasıl değişir?', options: ['Yarıya iner', 'İki katına çıkar', 'Dört katına çıkar', 'Değişmez'], correctOptionIndex: 1 },
        { subTopic: 'Kimyasal Tepkimelerde Enerji', text: 'Isı alarak gerçekleşen (endotermik) tepkimeler için entalpi değişimi $$\\Delta H$$\'nin işareti nedir?', options: ['$$\\Delta H > 0$$', '$$\\Delta H < 0$$', '$$\\Delta H = 0$$', 'Belirlenemez'], correctOptionIndex: 0 },
        { subTopic: 'Tepkime Hızı', text: 'Bir kimyasal tepkimeye pozitif katalizör eklendiğinde aşağıdakilerden hangisi azalır?', options: ['Tepkime entalpisi', 'Aktifleşme enerjisi', 'Ürün miktarı', 'Denge sabiti'], correctOptionIndex: 1 },
        { subTopic: 'Organik Kimyaya Giriş', text: 'Doymuş hidrokarbonlar (alkanlar) sınıfının genel formülü aşağıdakilerden hangisidir?', options: ['$$\text{C}_n\text{H}_{2n-2}$$', '$$\text{C}_n\text{H}_{2n}$$', '$$\text{C}_n\text{H}_{2n+2}$$', '$$\text{C}_n\text{H}_n$$'], correctOptionIndex: 2 },
        { subTopic: 'Elektrokimya', text: 'Galvanik bir hücrede yükseltgenme yarı tepkimesi hangi elektrotta gerçekleşir?', options: ['Katot', 'Anot', 'Tuz köprüsü', 'Dış devre'], correctOptionIndex: 1 },
      ],
      MEDIUM: [
        { subTopic: 'Molarite', text: '$$0.4\\text{ mol NaOH}$$ katısı suda çözülerek toplam hacim $$200\\text{ mL}$$\'ye tamamlanıyor. Çözeltinin molar derişimi kaç $$\\text{M}$$ olur?', options: ['0.5', '1.0', '2.0', '4.0'], correctOptionIndex: 2 },
        { subTopic: 'İdeal Gaz Denklemi', text: '$$0^\\circ\\text{C}$$ sıcaklıkta $$5.6\\text{ L}$$ sabit hacimli kapta bulunan $$0.5\\text{ mol}$$ ideal gazın basıncı kaç $$\\text{atm}$$ olur?', options: ['1', '2', '3', '4'], correctOptionIndex: 1 },
        { subTopic: 'Kimyasal Denge', text: 'İleri yöndeki hız sabiti $$k_i = 0.6$$ ve geri yöndeki hız sabiti $$k_g = 0.15$$ olan tek basamaklı denge tepkimesinin denge sabiti $$K_c$$ kaçtır?', options: ['2', '3', '4', '6'], correctOptionIndex: 2 },
        { subTopic: 'Sulu Çözeltilerde pH', text: '$$25^\\circ\\text{C}$$\'de $$0.01\\text{ M HCl}$$ kuvvetli asit çözeltisinin $$\\text{pH}$$ değeri kaçtır?', options: ['1', '2', '12', '13'], correctOptionIndex: 1 },
        { subTopic: 'Yükseltgenme Basamakları', text: '$$\text{KMnO}_4$$ bileşiğinde $$\text{Mn}$$ (Mangan) elementinin yükseltgenme basamağı kaçtır? ($$\text{K}: +1, \text{O}: -2$$)', options: ['+4', '+5', '+6', '+7'], correctOptionIndex: 3 },
        { subTopic: 'Hibritleşme', text: 'Metan ($$\text{CH}_4$$) molekülündeki merkez karbon atomunun hibritleşme türü nedir?', options: ['$$sp$$', '$$sp^2$$', '$$sp^3$$', '$$dsp^2$$'], correctOptionIndex: 2 },
      ],
      HARD: [
        { subTopic: 'Çözünürlük Dengesi (Kçç)', text: 'Belirli bir sıcaklıkta $$\text{AgCl}$$ katısının saf sudaki çözünürlüğü $$10^{-5}\\text{ M}$$ olduğuna göre çözünürlük çarpımı $$K_{\\text{çç}}$$ kaçtır?', options: ['$$10^{-5}$$', '$$2 \\times 10^{-5}$$', '$$10^{-10}$$', '$$4 \\times 10^{-10}$$'], correctOptionIndex: 2 },
        { subTopic: 'Faraday Elektroliz Yasası', text: 'Erimiş $$\text{AlCl}_3$$ tuzu $$3\\text{ Faraday}$$ elektrik yükü ile elektroliz edildiğinde katotta kaç mol $$\text{Al}$$ metali toplanır? ($$\text{Al}^{3+}$$)', options: ['0.5', '1', '2', '3'], correctOptionIndex: 1 },
        { subTopic: 'Nernst Denklemi ve Pil Potansiyeli', text: '$$\text{Zn}(k) + \text{Cu}^{2+}(1\\text{ M}) \\rightarrow \text{Zn}^{2+}(1\\text{ M}) + \text{Cu}(k)$$ pilinde $$E^\\circ_{\\text{pil}} = 1.10\\text{ V}$$ olduğuna göre $$\text{Cu}^{2+}$$ derişimi artırılırsa pil potansiyeli nasıl değişir?', options: ['1.10 V\'tan büyük olur', '1.10 V\'tan küçük olur', 'Değişmez', 'Sıfır olur'], correctOptionIndex: 0 },
        { subTopic: 'Hess Yasası', text: '$$\text{C}(k) + \text{O}_2(g) \\rightarrow \text{CO}_2(g)$$ tepkimesinin entalpisi $$\\Delta H = -390\\text{ kJ}$$ ise $$2\text{CO}_2(g) \\rightarrow 2\text{C}(k) + 2\text{O}_2(g)$$ tepkimesinin $$\\Delta H$$ değeri kaç $$\\text{kJ}$$ olur?', options: ['-780', '-390', '+390', '+780'], correctOptionIndex: 3 },
        { subTopic: 'Hız Denklemi Bulma', text: 'Hız bağıntısı $$r = k \\cdot [A]^2 \\cdot [B]$$ olan bir tepkimede kabın hacmi sabit sıcaklıkta yarıya indirilirse tepkime hızı kaç katına çıkar?', options: ['2', '4', '6', '8'], correctOptionIndex: 3 },
        { subTopic: 'Organik Fonksiyonel Gruplar', text: 'Bir karboksilik asit ile bir alkolün su açığa çıkararak birleşmesi tepkimesinden oluşan organik bileşik sınıfı hangisidir?', options: ['Eter', 'Ester', 'Aldehit', 'Keton'], correctOptionIndex: 1 },
      ],
    },
    turkce: {
      EASY: [
        { subTopic: 'Söz Sanatları', text: '"Güneş her sabah bize gülümseyerek doğardı." dizelerinde kullanılan söz sanatı hangisidir?', options: ['Teşbih (Benzetme)', 'Teşhis (Kişileştirme)', 'Mübalağa (Abartma)', 'Tezat (Karşıtlık)'], correctOptionIndex: 1 },
        { subTopic: 'Şiir Bilgisi', text: 'Dörtlük nazım birimiyle ve $$11$$\'li hece ölçüsüyle söylenen, aşk ve doğa temalı halk şiiri nazım biçimi hangisidir?', options: ['Koşma', 'Semai', 'Varsağı', 'Destan'], correctOptionIndex: 0 },
        { subTopic: 'İslamiyet Öncesi Türk Edebiyatı', text: 'İslamiyet öncesi Türk edebiyatında ölen bir kişinin arkasından duyulan acıyı anlatmak için söylenen şiirlere ne ad verilir?', options: ['Koşuk', 'Sav', 'Sagu', 'Destan'], correctOptionIndex: 2 },
        { subTopic: 'Divan Edebiyatı', text: 'Divan edebiyatında $$a-a, b-a, c-a...$$ uyak düzeniyle yazılan, $$5-15$$ beyitten oluşan ve aşk, şarap, güzellik konularını işleyen nazım biçimi hangisidir?', options: ['Mesnevi', 'Gazel', 'Kaside', 'Rubai'], correctOptionIndex: 1 },
        { subTopic: 'Tanzimat Edebiyatı', text: 'Türk edebiyatında ilk yerli roman kabul edilen "Taaşşuk-ı Talat ve Fitnat" adlı eserin yazarı kimdir?', options: ['Namık Kemal', 'Şemsettin Sami', 'Ahmet Mithat Efendi', 'Recaizade Mahmut Ekrem'], correctOptionIndex: 1 },
        { subTopic: 'Millî Edebiyat', text: 'Ömer Seyfettin, Ali Canip Yöntem ve Ziya Gökalp\'in Selanik\'te çıkardıkları ve "Yeni Lisan" makalesinin yayımlandığı dergi hangisidir?', options: ['Servet-i Fünun', 'Genç Kalemler', 'Dergâh', 'Yedi Meşale'], correctOptionIndex: 1 },
      ],
      MEDIUM: [
        { subTopic: 'Geçiş Dönemi Eserleri', text: 'Yusuf Has Hacib tarafından $$11.$$ yüzyılda kaleme alınan ve Türk edebiyatının ilk siyasetnamesi ile ilk mesnevisi kabul edilen eser hangisidir?', options: ['Divanü Lügati\'t-Türk', 'Kutadgu Bilig', 'Atabetü\'l-Hakayık', 'Divan-ı Hikmet'], correctOptionIndex: 1 },
        { subTopic: 'Halk Edebiyatı Temsilcileri', text: '"Uzun ince bir yoldayım" dizeleriyle tanınan, Cumhuriyet dönemi âşık tarzı halk şiirinin en önemli temsilcisi kimdir?', options: ['Karacaoğlan', 'Dadaloğlu', 'Âşık Veysel Şatıroğlu', 'Köroğlu'], correctOptionIndex: 2 },
        { subTopic: 'Servet-i Fünun Romanı', text: 'Türk edebiyatında Batılı anlamda ilk modern roman sayılan "Mai ve Siyah" ile "Aşk-ı Memnu" eserlerinin yazarı kimdir?', options: ['Mehmet Rauf', 'Halit Ziya Uşaklıgil', 'Tevfik Fikret', 'Cenap Şahabettin'], correctOptionIndex: 1 },
        { subTopic: 'Cumhuriyet Dönemi Şiiri', text: 'Orhan Veli Kanık, Melih Cevdet Anday ve Oktay Rifat\'ın ölçü ve uyağı reddederek kurdukları şiir topluluğu hangisidir?', options: ['Beş Hececiler', 'Garip (I. Yeni)', 'İkinci Yeni', 'Hisarcılar'], correctOptionIndex: 1 },
        { subTopic: 'Edebi Akımlar', text: 'Gözlem ve belgeye büyük önem veren, "roman, uzun bir yol boyunca gezdirilen aynadır" anlayışını benimseyen edebi akım hangisidir?', options: ['Romantizm', 'Realizm', 'Sembolizm', 'Sürrealizm'], correctOptionIndex: 1 },
        { subTopic: 'Geleneksel Türk Tiyatrosu', text: 'Kavuklu ve Pişekâr adlı başkahramanların yer aldığı, etrafı izleyicilerle çevrili bir alanda doğaçlama oynanan geleneksel tiyatro türü hangisidir?', options: ['Karagöz', 'Orta Oyunu', 'Meddah', 'Köy Seyirlik Oyunu'], correctOptionIndex: 1 },
      ],
      HARD: [
        { subTopic: 'Divan Edebiyatı Şairleri', text: '16. yüzyıl Divan şairi olan, "Su Kasidesi" ve "Leyla vü Mecnun" mesnevisiyle tanınan büyük şairimiz kimdir?', options: ['Bâkî', 'Fuzûlî', 'Nedîm', 'Şeyh Gâlip'], correctOptionIndex: 1 },
        { subTopic: 'Tanzimat Tiyatrosu', text: 'Şinasi tarafından yazılan ve Türk edebiyatında Batılı anlamda ilk tiyatro eseri kabul edilen töre komedisi hangisidir?', options: ['Vatan yahut Silistre', 'Şair Evlenmesi', 'Çok Bilen Çok Yanılır', 'Zavallı Çocuk'], correctOptionIndex: 1 },
        { subTopic: 'Cumhuriyet Dönemi Romanı', text: '"Saatleri Ayarlama Enstitüsü" ve "Huzur" romanlarında Doğu-Batı çatışmasını, zaman ve musiki kavramlarını işleyen yazarımız kimdir?', options: ['Peyami Safa', 'Ahmet Hamdi Tanpınar', 'Yakup Kadri Karaosmanoğlu', 'Oğuz Atay'], correctOptionIndex: 1 },
        { subTopic: 'Modernist Roman', text: 'Türk edebiyatında postmodernizmin öncüsü sayılan "Tutunamayanlar" ve "Tehlikeli Oyunlar" adlı eserlerin yazarı kimdir?', options: ['Yaşar Kemal', 'Orhan Kemal', 'Oğuz Atay', 'Kemal Tahir'], correctOptionIndex: 2 },
        { subTopic: 'Fecriati Topluluğu', text: '"Sanat şahsi ve muhteremdir" görüşünü savunan Fecriati topluluğunun en önemli şairi olup "Merdiven" ve "Sessiz Gemi" şiirleriyle?(Not: Sessiz Gemi Yahya Kemal, Merdiven ve Obeliks) "Merdiven" şiiriyle tanınan şair kimdir?', options: ['Ahmet Haşim', 'Yahya Kemal Beyatlı', 'Faruk Nafiz Çamlıbel', 'Necip Fazıl Kısakürek'], correctOptionIndex: 0 },
        { subTopic: 'İkinci Yeni Şiiri', text: '"Üvercinka" ve "Göçebe" adlı şiir kitaplarıyla İkinci Yeni hareketinin öncü isimlerinden olan şairimiz kimdir?', options: ['Cemal Süreya', 'Attilâ İlhan', 'Cahit Sıtkı Tarancı', 'Ahmet Muhip Dıranas'], correctOptionIndex: 0 },
      ],
    },
  },
};

function seedAll() {
  let totalQuestions = 0;
  let filesUpdated = 0;

  for (const [examKey, subjects] of Object.entries(templates)) {
    const examType = examKey.toUpperCase();
    for (const [subject, diffs] of Object.entries(subjects)) {
      for (const [difficulty, sampleList] of Object.entries(diffs)) {
        const fileName = `${difficulty.toLowerCase()}.json`;
        const filePath = path.join(baseDir, examKey, subject, fileName);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        let existingQuestions = [];
        let defaultDurationMs = 60000;
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8').trim();
          if (raw.length > 0) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed.questions)) {
                existingQuestions = parsed.questions;
              }
              if (parsed.meta && parsed.meta.defaultDurationMs) {
                defaultDurationMs = parsed.meta.defaultDurationMs;
              }
            } catch {
              existingQuestions = [];
            }
          }
        }

        const existingTexts = new Set(existingQuestions.map((q) => q.text));
        const prefix = `${examType}-${subject.slice(0, 3).toUpperCase()}-${difficulty[0]}`;
        let nextIndex = existingQuestions.length + 1;

        for (const item of sampleList) {
          if (!existingTexts.has(item.text)) {
            existingQuestions.push({
              externalId: `${prefix}-${String(nextIndex).padStart(3, '0')}`,
              subTopic: item.subTopic,
              text: item.text,
              imageUrl: null,
              options: item.options,
              correctOptionIndex: item.correctOptionIndex,
              ...(item.durationMs ? { durationMs: item.durationMs } : {}),
            });
            existingTexts.add(item.text);
            nextIndex += 1;
          }
        }

        const payload = {
          meta: {
            examType,
            subject,
            difficulty,
            defaultDurationMs,
          },
          questions: existingQuestions,
        };

        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
        totalQuestions += existingQuestions.length;
        filesUpdated += 1;
      }
    }
  }

  console.log(`Seeded ${filesUpdated} question bank files (${totalQuestions} total questions).`);
}

if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };
