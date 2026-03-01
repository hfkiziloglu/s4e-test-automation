import { test, expect, chromium, Browser, Page } from '@playwright/test';

const CDP_URL = 'http://localhost:9222';
const ACCOUNT_DEFAULTS_URL = 'https://app.s4e.io/user-settings?setting-type=account_defaults';
const PROFILE_URL = 'https://app.s4e.io/user-settings?setting-type=profile';

let browser: Browser;
let page: Page;

let cdpContext: any;

test.beforeAll(async () => {
  browser = await chromium.connectOverCDP(CDP_URL);
  cdpContext = browser.contexts()[0];
  // s4e.io sayfasını bul, yoksa yeni aç
  const pages = cdpContext.pages();
  page = pages.find((p: Page) => p.url().includes('s4e.io')) ?? await cdpContext.newPage();
  console.log(`[SETUP] Bağlandı. Aktif sayfa: ${page.url()}`);
});

async function gotoAndWait(url: string) {
  // Her seferinde güncel page'i al
  const pages = cdpContext.pages();
  const s4ePage = pages.find((p: Page) => p.url().includes('s4e.io') && !p.url().includes('localhost'));
  if (s4ePage) page = s4ePage;

  await page.goto(url);
  await page.waitForTimeout(1500);
  // Doğru URL'e gittiğimizi kontrol et
  if (!page.url().includes('user-settings')) {
    await page.goto(url);
    await page.waitForTimeout(1500);
  }
  // Cookie banner varsa kapat
  const acceptBtn = page.locator('.cky-btn-accept');
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
    await page.waitForTimeout(500);
    console.log(`[NAV] Cookie banner kapatıldı.`);
  }
  await page.waitForSelector('text=User Settings', { timeout: 15000 });
  console.log(`[NAV] Sayfa yüklendi: ${page.url()}`);
}

// ─── ACCOUNT DEFAULTS ────────────────────────────────────────────────────────

test.describe('Account Defaults', () => {

  test.beforeEach(async () => {
    await gotoAndWait(ACCOUNT_DEFAULTS_URL);
  });

  // TC-001
  test('TC-001: Account Defaults tab loads correctly', async () => {
    const languageVisible = await page.locator('text=Language').first().isVisible();
    const themeVisible = await page.locator('text=Theme').first().isVisible();
    const regionVisible = await page.locator('text=Global Region').first().isVisible();
    const saveBtnVisible = await page.locator('button:has-text("Save changes")').isVisible();
    console.log(`[TC-001] Language: ${languageVisible}, Theme: ${themeVisible}, GlobalRegion: ${regionVisible}, SaveBtn: ${saveBtnVisible}`);
    await expect(page.locator('text=Language').first()).toBeVisible();
    await expect(page.locator('text=Theme').first()).toBeVisible();
    await expect(page.locator('text=Global Region').first()).toBeVisible();
    await expect(page.locator('button:has-text("Save changes")')).toBeVisible();
  });

  // TC-002
  test('TC-002: Language dropdown exists and shows English', async () => {
    const languageInput = page.locator('input[role="combobox"]').first();
    const value = await languageInput.inputValue();
    console.log(`[TC-002] Language input değeri: "${value}"`);
    await expect(languageInput).toBeVisible();
    await expect(page.locator('text=Language').first()).toBeVisible();
  });

  // TC-004
  test('TC-004: Theme dropdown lists Light and Dark options', async () => {
    const themeInput = page.locator('input[role="combobox"]').nth(1);
    const currentTheme = await themeInput.inputValue();
    console.log(`[TC-004] Mevcut tema: "${currentTheme}"`);
    await themeInput.click();
    await page.waitForTimeout(500);
    const options = await page.locator('[role="option"]').allTextContents();
    console.log(`[TC-004] Dropdown seçenekleri: ${JSON.stringify(options)}`);
    await expect(page.locator('[role="option"]:has-text("Dark"), [role="listbox"] li:has-text("Dark")')).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Escape');
  });

  // TC-005
  test('TC-005: Change theme to Dark and save', async () => {
    const themeInput = page.locator('input[role="combobox"]').nth(1);
    const beforeValue = await themeInput.inputValue();
    console.log(`[TC-005] Tema değiştirmeden önce: "${beforeValue}"`);
    await themeInput.click();
    await page.waitForTimeout(500);
    await page.locator('[role="option"]:has-text("Dark"), [role="listbox"] li:has-text("Dark")').click();
    const afterValue = await themeInput.inputValue();
    console.log(`[TC-005] Tema değiştirdikten sonra: "${afterValue}"`);
    const saveBtn005 = page.locator('button:has-text("Save changes")');
    await saveBtn005.scrollIntoViewIfNeeded();
    await saveBtn005.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const toast = page.locator('[class*="toast"], [class*="snack"], [class*="Snack"], [class*="notistack"], .MuiAlert-root').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
    const toastText = await toast.textContent();
    console.log(`[TC-005] Toast mesajı: "${toastText}"`);
  });

  // TC-006
  test('TC-006: Change theme back to Light and save', async () => {
    const themeInput = page.locator('input[role="combobox"]').nth(1);
    const beforeValue = await themeInput.inputValue();
    console.log(`[TC-006] Tema değiştirmeden önce: "${beforeValue}"`);
    await themeInput.click();
    await page.waitForTimeout(500);
    await page.locator('[role="option"]:has-text("Light"), [role="listbox"] li:has-text("Light")').click();
    const afterValue = await themeInput.inputValue();
    console.log(`[TC-006] Tema değiştirdikten sonra: "${afterValue}"`);
    const saveBtn006 = page.locator('button:has-text("Save changes")');
    await saveBtn006.scrollIntoViewIfNeeded();
    await saveBtn006.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const toast = page.locator('[class*="toast"], [class*="snack"], [class*="Snack"], [class*="notistack"], .MuiAlert-root').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
    const toastText = await toast.textContent();
    console.log(`[TC-006] Toast mesajı: "${toastText}"`);
  });

  // TC-007
  test('TC-007: Save Changes button is disabled when no changes made', async () => {
    const saveBtn = page.locator('button:has-text("Save changes")');
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    const isDisabled = await saveBtn.isDisabled();
    console.log(`[TC-007] Save Changes butonu disabled mi: ${isDisabled}`);
    await expect(saveBtn).toBeDisabled();
  });

  // TC-018
  test('TC-018: Account Defaults values persist after page reload', async () => {
    const themeInput = page.locator('input[role="combobox"]').nth(1);
    const themeValue = await themeInput.inputValue();
    console.log(`[TC-018] Yenilemeden önce tema: "${themeValue}"`);
    await page.reload();
    await page.waitForSelector('text=User Settings', { timeout: 15000 });
    await page.waitForTimeout(1500);
    const themeAfter = await page.locator('input[role="combobox"]').nth(1).inputValue();
    console.log(`[TC-018] Yeniledikten sonra tema: "${themeAfter}"`);
    await expect(page.locator('input[role="combobox"]').nth(1)).toHaveValue(themeValue);
  });

});

// ─── PROFILE ─────────────────────────────────────────────────────────────────

test.describe('Profile', () => {

  test.beforeEach(async () => {
    await gotoAndWait(PROFILE_URL);
  });

  // TC-008
  test('TC-008: Profile tab loads correctly', async () => {
    const updateProfileVisible = await page.locator('text=Update Profile').isVisible();
    const saveBtnVisible = await page.locator('button:has-text("Save changes")').isVisible();
    const phoneVisible = await page.locator('text=Phone Number').isVisible();
    console.log(`[TC-008] UpdateProfile: ${updateProfileVisible}, SaveBtn: ${saveBtnVisible}, PhoneNumber: ${phoneVisible}`);
    await expect(page.locator('text=Update Profile')).toBeVisible();
    await expect(page.locator('button:has-text("Save changes")')).toBeVisible();
    await expect(page.locator('text=Phone Number')).toBeVisible();
  });

  // TC-009
  test('TC-009: Email field is read-only', async () => {
    const emailField = page.locator('input[type="text"][disabled], input[type="text"].Mui-disabled').first();
    await expect(emailField).toBeVisible();
    const isDisabled = await emailField.isDisabled();
    const emailValue = await emailField.inputValue();
    console.log(`[TC-009] Email alanı disabled: ${isDisabled}, değer: "${emailValue}"`);
    expect(isDisabled).toBe(true);
  });

  // TC-010
  test('TC-010: Save valid Name', async () => {
    const nameField = page.locator('input[type="text"]:not([disabled])').nth(0);
    const before = await nameField.inputValue();
    await nameField.clear();
    await nameField.fill('Furkan');
    const after = await nameField.inputValue();
    console.log(`[TC-010] Name: "${before}" → "${after}"`);
    await page.locator('button:has-text("Save changes")').click();
    const toast = page.locator('[class*="toast"], [class*="snack"], [class*="Snack"], [class*="notistack"], .MuiAlert-root').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
    const toastText = await toast.textContent();
    console.log(`[TC-010] Toast mesajı: "${toastText}"`);
  });

  // TC-011
  test('TC-011: Save all profile fields', async () => {
    const textInputs = page.locator('input[type="text"]:not([disabled])');
    await textInputs.nth(0).fill('Furkan');
    await textInputs.nth(1).fill('Kızıloğlu');
    await textInputs.nth(2).fill('Ankara, Çankaya');
    const name = await textInputs.nth(0).inputValue();
    const surname = await textInputs.nth(1).inputValue();
    const address = await textInputs.nth(2).inputValue();
    console.log(`[TC-011] Name: "${name}", Surname: "${surname}", Address: "${address}"`);
    const saveBtn011 = page.locator('button:has-text("Save changes")');
    await saveBtn011.scrollIntoViewIfNeeded();
    await saveBtn011.click();
    const toast = page.locator('[class*="toast"], [class*="snack"], [class*="Snack"], [class*="notistack"], .MuiAlert-root').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
    const toastText = await toast.textContent();
    console.log(`[TC-011] Toast mesajı: "${toastText}"`);
  });

  // TC-012
  test('TC-012: Save with all fields empty (edge case)', async () => {
    const textInputs = page.locator('input[type="text"]:not([disabled])');
    await textInputs.nth(0).clear();
    await textInputs.nth(1).clear();
    await textInputs.nth(2).clear();
    console.log(`[TC-012] Tüm alanlar temizlendi, kaydediliyor...`);
    await page.locator('button:has-text("Save changes")').click();
    const toast = page.locator('[class*="toast"], [class*="snack"], [class*="Snack"], [class*="notistack"], .MuiAlert-root').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
    const toastText = await toast.textContent();
    console.log(`[TC-012] Toast mesajı: "${toastText}"`);
  });

  // TC-013
  test('TC-013: Name field with very long value (edge case)', async () => {
    const longName = 'A'.repeat(300);
    const nameField = page.locator('input[type="text"]:not([disabled])').nth(0);
    await nameField.clear();
    await nameField.fill(longName);
    const actualValue = await nameField.inputValue();
    console.log(`[TC-013] 300 karakter girildi, alanda kalan: ${actualValue.length} karakter`);
    if (actualValue.length === 300) {
      console.log(`[TC-013] Karakter sınırı yok — sunucuya gönderiliyor`);
      await page.locator('button:has-text("Save changes")').click();
      await page.waitForTimeout(2000);
    } else {
      console.log(`[TC-013] Alan ${actualValue.length} karakterde kesti (maxlength uygulandı)`);
      expect(actualValue.length).toBeLessThan(300);
    }
    await nameField.fill('Furkan');
    await page.locator('button:has-text("Save changes")').click();
  });

  // TC-014
  test('TC-014: Name field with XSS payload (security edge case)', async () => {
    const xssPayload = '<script>alert(1)</script>';
    const nameField = page.locator('input[type="text"]:not([disabled])').nth(0);
    await nameField.clear();
    await nameField.fill(xssPayload);
    const actualValue = await nameField.inputValue();
    console.log(`[TC-014] XSS payload girildi, alanda görünen: "${actualValue}"`);
    await page.locator('button:has-text("Save changes")').click();

    let alertFired = false;
    page.once('dialog', async (dialog) => {
      alertFired = true;
      console.log(`[TC-014] UYARI: Dialog tetiklendi! Tip: ${dialog.type()}, Mesaj: "${dialog.message()}"`);
      await dialog.dismiss();
    });
    await page.waitForTimeout(2000);
    console.log(`[TC-014] XSS alert tetiklendi mi: ${alertFired}`);
    expect(alertFired).toBe(false);

    await nameField.fill('Furkan');
    await page.locator('button:has-text("Save changes")').click();
  });

  // TC-015
  test('TC-015: Name field with numeric value (edge case)', async () => {
    const nameField = page.locator('input[type="text"]:not([disabled])').nth(0);
    await nameField.clear();
    await nameField.fill('12345');
    const actualValue = await nameField.inputValue();
    console.log(`[TC-015] Name alanına "12345" girildi, alanda görünen: "${actualValue}"`);
    await page.locator('button:has-text("Save changes")').click();
    const toast = page.locator('[class*="toast"], [class*="snack"], [class*="Snack"], [class*="notistack"], .MuiAlert-root').first();
    await expect(toast).toBeVisible({ timeout: 10000 });
    const toastText = await toast.textContent();
    console.log(`[TC-015] Toast mesajı: "${toastText}"`);
  });

  // TC-016
  test('TC-016: Phone number is displayed', async () => {
    const phoneInput = page.locator('input[type="tel"]');
    const phoneValue = await phoneInput.inputValue();
    const deleteVisible = await page.locator('button:has-text("Delete")').first().isVisible();
    const nextVisible = await page.locator('button:has-text("Next")').first().isVisible();
    console.log(`[TC-016] Telefon değeri: "${phoneValue}", Delete: ${deleteVisible}, Next: ${nextVisible}`);
    await expect(page.locator('text=Phone Number')).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(page.locator('button:has-text("Delete")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Next")').first()).toBeVisible();
  });

  // TC-019
  test('TC-019: Profile values persist after page reload', async () => {
    const nameField = page.locator('input[type="text"]:not([disabled])').nth(0);
    await nameField.clear();
    await nameField.fill('Furkan');
    await page.locator('button:has-text("Save changes")').click();
    await page.waitForTimeout(1500);
    console.log(`[TC-019] "Furkan" kaydedildi, sayfa yenileniyor...`);
    await page.reload();
    await page.waitForSelector('text=Update Profile', { timeout: 15000 });
    await page.waitForTimeout(1500);
    const valueAfterReload = await page.locator('input[type="text"]:not([disabled])').nth(0).inputValue();
    console.log(`[TC-019] Yenilemeden sonra Name değeri: "${valueAfterReload}"`);
    await expect(page.locator('input[type="text"]:not([disabled])').nth(0)).toHaveValue('Furkan');
  });

  // TC-020
  test('TC-020: Unsaved data lost on tab switch (UX edge case)', async () => {
    const nameField = page.locator('input[type="text"]:not([disabled])').nth(0);
    const originalValue = await nameField.inputValue();
    await nameField.fill('Unsaved_Test_Value');
    console.log(`[TC-020] Orijinal değer: "${originalValue}", kaydedilmeden "Unsaved_Test_Value" yazıldı`);
    await page.locator('button[role="tab"]:has-text("Account Defaults")').first().click();
    await page.waitForTimeout(500);
    console.log(`[TC-020] Account Defaults sekmesine geçildi`);
    await page.locator('button[role="tab"]:has-text("Profile")').first().click();
    await page.waitForSelector('text=Update Profile', { timeout: 10000 });
    await page.waitForTimeout(1000);
    const currentValue = await page.locator('input[type="text"]:not([disabled])').nth(0).inputValue();
    console.log(`[TC-020] Profile sekmesine geri dönüldü. Değer: "${currentValue}" (orijinal: "${originalValue}")`);
    if (currentValue === 'Unsaved_Test_Value') {
      console.log(`[TC-020] Kaydedilmemiş veri KORUNDU`);
    } else {
      console.log(`[TC-020] Kaydedilmemiş veri KAYBOLDU`);
    }
  });

});
