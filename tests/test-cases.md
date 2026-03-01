# Test Cases - User Settings (S4E)

**Module:** User Settings
**URL:** https://app.s4e.io/user-settings
**Tester:** Furkan Kızıloğlu
**Date:** 2026-03-01

---

## Scope

- Account Defaults tab (`?setting-type=account-default`)
- Profile tab (`?setting-type=profile`)
- Out of scope: My Products, Security, Alerts & Mails, AI Alert Profile, Custom Report Template, Delete Account

---

## TC-001: Account Defaults tab'ına erişim

**Precondition:** Kullanıcı giriş yapmış, User Settings sayfasındayız
**Steps:**
1. `https://app.s4e.io/user-settings?setting-type=account-default` adresine git

**Expected:** Sayfa yüklenir, Language / Theme / Global Region dropdown'ları görünür, Save Changes butonu görünür
**Type:** Smoke

---

## TC-002: Language dropdown seçenekleri listeleniyor

**Precondition:** Account Defaults tab açık
**Steps:**
1. Language dropdown'a tıkla

**Expected:** Dropdown açılır, en az bir dil seçeneği listelenir
**Type:** Functional

---

## TC-003: Language değiştirip kaydetme

**Precondition:** Account Defaults tab açık, mevcut dil English
**Steps:**
1. Language dropdown'u aç
2. English dışında bir dil seç (varsa)
3. Save Changes butonuna tıkla

**Expected:** Başarı mesajı gösterilir (toast/alert), sayfa yenilenince seçilen dil kalıcı olur
**Type:** Functional

---

## TC-004: Theme dropdown seçenekleri listeleniyor

**Precondition:** Account Defaults tab açık
**Steps:**
1. Theme dropdown'a tıkla

**Expected:** Light ve Dark seçenekleri listelenir
**Type:** Functional

---

## TC-005: Theme değiştirip kaydetme - Dark

**Precondition:** Account Defaults tab açık, mevcut tema Light
**Steps:**
1. Theme dropdown'u aç
2. Dark seç
3. Save Changes butonuna tıkla

**Expected:** Başarı mesajı gösterilir, arayüz dark temaya geçer, sayfa yenilenince Dark seçili kalır
**Type:** Functional

---

## TC-006: Theme değiştirip kaydetme - Light (geri alma)

**Precondition:** Tema Dark olarak ayarlanmış
**Steps:**
1. Theme dropdown'u aç
2. Light seç
3. Save Changes butonuna tıkla

**Expected:** Başarı mesajı gösterilir, arayüz light temaya döner
**Type:** Functional

---

## TC-007: Save Changes butonuna değişiklik yapmadan tıklamak

**Precondition:** Account Defaults tab açık, herhangi bir değer değiştirilmemiş
**Steps:**
1. Hiçbir dropdown'u değiştirmeden Save Changes butonuna tıkla

**Expected:** Save Changes butonu `disabled` durumdadır; herhangi bir değişiklik yapılmadığında tıklanamaz
**Type:** Edge Case

---

## TC-008: Profile tab'ına erişim

**Precondition:** Kullanıcı giriş yapmış
**Steps:**
1. User Settings'te Profile tab'ına tıkla

**Expected:** Sayfa yüklenir; Email alanı (read-only, dolu), Name, Surname, Address alanları görünür; Save Changes butonu görünür; Phone Number bölümü görünür
**Type:** Smoke

---

## TC-009: Email alanı read-only olmalı

**Precondition:** Profile tab açık
**Steps:**
1. Email alanına tıkla
2. Değer silmeye veya yazmaya çalış

**Expected:** Email alanı düzenlenemez (disabled/readonly), mevcut email adresi görüntüleniyor
**Type:** Functional

---

## TC-010: Name alanını doldurup kaydetme

**Precondition:** Profile tab açık
**Steps:**
1. Name alanına geçerli bir isim yaz (ör. "Furkan")
2. Save Changes butonuna tıkla

**Expected:** Başarı mesajı gösterilir, sayfa yenilenince girilen isim Name alanında görünür
**Type:** Functional

---

## TC-011: Tüm alanları doldurup kaydetme

**Precondition:** Profile tab açık
**Steps:**
1. Name alanına "Furkan" yaz
2. Surname alanına "Kızıloğlu" yaz
3. Address alanına "Ankara" yaz
4. Save Changes butonuna tıkla

**Expected:** Başarı mesajı gösterilir, tüm alanlar kaydedilir
**Type:** Functional

---

## TC-012: Tüm alanları boş bırakıp kaydetme

**Precondition:** Profile tab açık, Name/Surname/Address alanları dolu
**Steps:**
1. Name, Surname, Address alanlarını temizle (boş bırak)
2. Save Changes butonuna tıkla

**Expected:** Boş değerler kaydedilir (opsiyonel alanlarsa) VEYA validasyon hatası gösterilir
**Type:** Edge Case

---

## TC-013: Name alanına çok uzun değer girme

**Precondition:** Profile tab açık
**Steps:**
1. Name alanına 200 karakterden uzun bir string yaz
2. Save Changes butonuna tıkla

**Expected:** Frontend'de karakter sınırı uygulanmaz; 200+ karakter girilebilir ancak sunucu 200 karakteri aşan değerleri reddeder ve validasyon hatası gösterilir
**Type:** Edge Case

---

## TC-014: Name alanına özel karakter girme

**Precondition:** Profile tab açık
**Steps:**
1. Name alanına `<script>alert(1)</script>` yaz
2. Save Changes butonuna tıkla

**Expected:** Script tag'lar düz metin olarak kaydedilir, XSS çalışmaz; ya validasyon hatası gösterilir
**Type:** Edge Case / Security

---

## TC-015: Name alanına sayı girme

**Precondition:** Profile tab açık
**Steps:**
1. Name alanına "12345" yaz
2. Save Changes butonuna tıkla

**Expected:** Tamamen sayısal değer reddedilir ve validasyon hatası gösterilir
**Type:** Edge Case

---

## TC-016: Phone Number - mevcut numara görüntüleniyor

**Precondition:** Profile tab açık, önceden telefon numarası eklenmiş
**Steps:**
1. Phone Number bölümüne bak

**Expected:** Kayıtlı telefon numarası (+90 551 730 58 40) görüntüleniyor, Delete ve Next butonları mevcut
**Type:** Functional

---

## TC-017: Phone Number - Delete butonu

**Precondition:** Profile tab açık, telefon numarası kayıtlı
**Steps:**
1. Phone Number bölümündeki Delete butonuna tıkla

**Expected:** Onay dialog'u açılır VEYA numara silinir ve başarı mesajı gösterilir
**Type:** Functional

---

## TC-018: Account Defaults - sayfa yenilenince değerler korunuyor

**Precondition:** Account Defaults'ta Theme "Dark" kaydedilmiş
**Steps:**
1. Sayfayı F5 ile yenile

**Expected:** Theme dropdown hâlâ "Dark" gösterir
**Type:** Functional / Persistence

---

## TC-019: Profile - sayfa yenilenince değerler korunuyor

**Precondition:** Profile'da Name "Furkan" kaydedilmiş
**Steps:**
1. Sayfayı F5 ile yenile

**Expected:** Name alanı hâlâ "Furkan" gösterir
**Type:** Functional / Persistence

---

## TC-020: Tab geçişlerinde veri kaybolmuyor mu?

**Precondition:** Profile tab'ında Name alanına "Test" yazıldı ama henüz kaydedilmedi
**Steps:**
1. Account Defaults tab'ına geç
2. Tekrar Profile tab'ına dön

**Expected:** Kaydedilmemiş değişiklikler için uyarı gösterilmeli ya da form durumu korunmalıdır; ancak mevcut davranış: değişiklikler sessizce silinir (bkz. HATA-001)
**Type:** Edge Case / UX

---

**Total: 20 test cases**
