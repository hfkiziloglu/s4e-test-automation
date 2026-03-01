# Hata Raporu - User Settings (S4E)

**Modül:** User Settings
**URL:** https://app.s4e.io/user-settings
**Test Eden:** Hüseyin Furkan Kızıloğlu
**Tarih:** 2026-03-01
**Ortam:** Chrome (production), Windows 10

---

## HATA-001: Sekme Geçişinde Kaydedilmemiş Değişiklik Uyarısı Yok

**Önem:** Orta
**Öncelik:** Orta
**Tür:** UX / Veri Kaybı Önleme
**Sekme:** Profile → Account Defaults (veya tersi)

### Açıklama
Kullanıcı Profile sekmesindeki alanları kaydetmeden düzenleyip başka bir sekmeye (örn. Account Defaults) geçtiğinde, kaydedilmemiş değişiklikler sessizce silinmektedir. Herhangi bir onay iletişim kutusu veya uyarı gösterilmemektedir.

### Yeniden Üretme Adımları
1. `https://app.s4e.io/user-settings?setting-type=profile` adresine git
2. **Name** alanını herhangi bir değerle değiştir — **Save changes butonuna tıklamadan**
3. **Account Defaults** sekmesine tıkla
4. Tekrar **Profile** sekmesine tıkla
5. Name alanının değerini gözlemle

### Beklenen Davranış
- Onay iletişim kutusu: *"Kaydedilmemiş değişiklikleriniz var. Ayrılmak istediğinizden emin misiniz?"*, **veya**
- Sekmeler arasında geçişte kaydedilmemiş form durumunun korunması

### Gerçekleşen Davranış
Kaydedilmemiş değişiklikler sessizce silinmektedir. Test çıktısı:
```
TC-020 | Orijinal: "", kaydedilmeden "Unsaved_Test_Value" yazıldı
TC-020 | Profile sekmesine geri dönüldü. Değer: "Furkan" (orijinal: "")
TC-020 | Kaydedilmemiş veri KAYBOLDU
```

### İlgili Test Senaryosu
TC-020

---

## HATA-002: Save Changes Butonu Neden Pasif Olduğu Açıklanmadan Devre Dışı

**Önem:** Düşük
**Öncelik:** Düşük
**Tür:** UX / Eksik Geri Bildirim
**Sekme:** Account Defaults

### Açıklama
Account Defaults sekmesinde hiçbir dropdown değiştirilmediğinde **Save changes** butonu `disabled` durumdadır. Butonun neden pasif olduğuna dair herhangi bir araç ipucu, yardımcı metin veya açıklama gösterilmemektedir.

### Yeniden Üretme Adımları
1. `https://app.s4e.io/user-settings?setting-type=account_defaults` adresine git
2. Hiçbir açılır menüyü (Language / Theme / Global Region) değiştirme
3. **Save changes** butonunun pasif (gri) olduğunu gözlemle
4. Butonun üzerine gel — herhangi bir tooltip görünmediğini doğrula

### Beklenen Davranış
Buton disabled iken üzerine gelindiğinde neden pasif olduğunu açıklayan bir araç ipucu gösterilmeli (örn. *"Kaydedilecek değişiklik yok"*).

### Gerçekleşen Davranış
Buton `disabled` HTML özelliğine sahiptir (`Mui-disabled` class) ve herhangi bir araç ipucu veya açıklama gösterilmemektedir.

### İlgili Test Senaryosu
TC-007

---

## Özet Tablo

| ID       | Başlık                                                              | Önem  | Öncelik | Durum |
|----------|---------------------------------------------------------------------|-------|---------|-------|
| HATA-001 | Sekme geçişinde kaydedilmemiş değişiklik uyarısı yok                | Orta  | Orta    | Açık  |
| HATA-002 | Save Changes butonu neden pasif olduğu açıklanmıyor                 | Düşük | Düşük   | Açık  |
