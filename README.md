# S4E Test Otomasyonu - User Settings

[app.s4e.io](https://app.s4e.io) sitesinin **User Settings** modülü için Playwright tabanlı uçtan uca test paketi.

**Hazırlayan:** Hüseyin Furkan Kızıloğlu
**Tarih:** 2026-03-01

---

## Kapsam

| Sekme            | Test Edildi |
|------------------|-------------|
| Account Defaults | Evet        |
| Profile          | Evet        |
| Security         | Hayır       |
| Alerts & Mails   | Hayır       |
| Delete Account   | Hayır (riskli) |

---

## Test Senaryoları

20 manuel test senaryosu [`tests/test-cases.md`](tests/test-cases.md) dosyasında belgelenmiştir.

Bunların 18 tanesi [`tests/user-settings.spec.ts`](tests/user-settings.spec.ts) dosyasında otomatize edilmiştir.

| TC     | Açıklama                                                    | Tür                    | Otomatize |
|--------|-------------------------------------------------------------|------------------------|-----------|
| TC-001 | Account Defaults sekmesi doğru yükleniyor                   | Duman Testi            | Evet      |
| TC-002 | Language açılır menüsü mevcut ve English gösteriyor         | Fonksiyonel            | Evet      |
| TC-003 | Language değiştirip kaydetme                                | Fonksiyonel            | Hayır*    |
| TC-004 | Theme açılır menüsü Light ve Dark seçeneklerini listeliyor  | Fonksiyonel            | Evet      |
| TC-005 | Temayı Dark yapıp kaydetme                                  | Fonksiyonel            | Evet      |
| TC-006 | Temayı tekrar Light yapıp kaydetme                          | Fonksiyonel            | Evet      |
| TC-007 | Değişiklik yapılmadığında Save Changes butonu pasif         | Sınır Durumu           | Evet      |
| TC-008 | Profile sekmesi doğru yükleniyor                            | Duman Testi            | Evet      |
| TC-009 | Email alanı salt okunur olmalı                              | Fonksiyonel            | Evet      |
| TC-010 | Geçerli isim girip kaydetme                                 | Fonksiyonel            | Evet      |
| TC-011 | Tüm profil alanlarını doldurup kaydetme                     | Fonksiyonel            | Evet      |
| TC-012 | Tüm alanlar boşken kaydetme (sınır durumu)                  | Sınır Durumu           | Evet      |
| TC-013 | Name alanına çok uzun değer girme (sınır durumu)            | Sınır Durumu           | Evet      |
| TC-014 | Name alanına XSS payload girme (güvenlik testi)             | Güvenlik               | Evet      |
| TC-015 | Name alanına sayısal değer girme (sınır durumu)             | Sınır Durumu           | Evet      |
| TC-016 | Telefon numarası görüntüleniyor                             | Fonksiyonel            | Evet      |
| TC-017 | Telefon numarası silme butonu                               | Fonksiyonel            | Hayır*    |
| TC-018 | Account Defaults değerleri sayfa yenilemesinde korunuyor    | Kalıcılık              | Evet      |
| TC-019 | Profile değerleri sayfa yenilemesinde korunuyor             | Kalıcılık              | Evet      |
| TC-020 | Sekme geçişinde kaydedilmemiş veri kaybı (UX sınır durumu)  | UX                     | Evet      |

*TC-003: Yalnızca English mevcut, seçilebilecek başka bir dil yok.
*TC-017: Gerçek telefon numarasının yanlışlıkla silinmesini önlemek amacıyla atlandı.

---

## Hata Raporu

Test sırasında 2 hata tespit edildi — bkz. [`tests/bug-report.md`](tests/bug-report.md).

| ID       | Başlık                                                              | Önem  |
|----------|---------------------------------------------------------------------|-------|
| HATA-001 | Sekme geçişinde kaydedilmemiş değişiklik uyarısı yok                | Orta  |
| HATA-002 | Save Changes butonu neden pasif olduğu açıklanmıyor                 | Düşük |

---

## Kurulum

### Gereksinimler

- Node.js 18+
- Google Chrome yüklü
- [app.s4e.io](https://app.s4e.io) üzerinde aktif oturum (giriş gerekli)

### Bağımlılıkları Yükle

```bash
cd s4e-test-automation
npm install
npx playwright install chromium
```

---

## Testleri Çalıştırma

### Adım 1 — Chrome'u Uzaktan Hata Ayıklama Modunda Başlat

Testler, Cloudflare korumasını aşmak için CDP aracılığıyla gerçek bir Chrome örneğine bağlanır. Testleri çalıştırmadan **önce** Chrome'u uzaktan hata ayıklama özelliği etkin olarak başlatmalısınız.

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="C:\Users\user\AppData\Local\Temp\chrome-debug"
```

> **Not:** Gerekirse Chrome yükleme yolunu kendi sisteminize göre güncelleyin.

### Adım 2 — Giriş Yap

Açılan Chrome penceresinde [https://app.s4e.io](https://app.s4e.io) adresine git ve kimlik bilgilerinizle giriş yap. `app.s4e.io` içindeki herhangi bir sayfada kalabilirsiniz.

### Adım 3 — Testleri Çalıştır

```bash
npx playwright test
```

HTML raporu ile çalıştırmak için:

```bash
npx playwright test --reporter=html
npx playwright show-report
```

---

## Neden CDP (Chrome DevTools Protocol)?

app.s4e.io alan adı Cloudflare tarafından korunmaktadır; bu koruma Playwright'ın yerleşik Chromium tarayıcısını bot olarak algılar ve CAPTCHA/doğrulama sayfası gösterir. Gerçek bir Chrome örneğine CDP üzerinden bağlanarak Playwright, mevcut kimlik doğrulanmış tarayıcı oturumunu yeniden kullanır ve bot algılamasını tamamen atlar.

---

## Proje Yapısı

```
s4e-test-automation/
├── tests/
│   ├── user-settings.spec.ts   # Playwright test dosyası (18 test)
│   ├── test-cases.md           # Manuel test senaryosu dokümantasyonu (20 TC)
│   └── bug-report.md           # Hata raporu (2 hata)
├── playwright.config.ts        # Playwright yapılandırması
├── package.json
└── README.md
```
