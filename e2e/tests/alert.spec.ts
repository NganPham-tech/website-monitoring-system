import { test, expect } from '@playwright/test';
import { AlertSettingsPage } from '../pages/AlertSettingsPage';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * TEST SUITE: Alert Settings Flow
 * ──────────────────────────────────────────────────────────────────────────────
 * Kiểm tra trang /alerts/settings:
 *   - Bật/tắt trigger cảnh báo (website down, response chậm)
 *   - Nhập thông tin kênh Telegram / Email
 *   - Lưu cấu hình
 *   - Refresh trang → xác nhận cấu hình được giữ nguyên (persistence)
 * ══════════════════════════════════════════════════════════════════════════════
 */

test.describe('Alert — Cấu hình Cảnh báo', () => {
  let alertPage: AlertSettingsPage;

  test.beforeEach(async ({ page }) => {
    alertPage = new AlertSettingsPage(page);
    await alertPage.goto();
  });

  // ── Toggle Tests ────────────────────────────────────────────────────────────

  test('TC-ALERT-01 | Bật toggle "Website Down" — không crash, có thể save', async () => {
    // Bật toggle
    await alertPage.enableWebsiteDownAlert();

    // Assert: checkbox ở trạng thái checked
    await expect(alertPage.websiteDownToggle).toBeChecked();

    // Lưu và kiểm tra toast success
    await alertPage.save();
  });

  test('TC-ALERT-02 | Tắt toggle "Website Down" — trạng thái unchecked khi disable', async () => {
    // Đảm bảo đang bật trước
    await alertPage.enableWebsiteDownAlert();
    // Sau đó tắt
    await alertPage.disableWebsiteDownAlert();

    await expect(alertPage.websiteDownToggle).not.toBeChecked();
  });

  test('TC-ALERT-03 | Bật "Response Time chậm" — input ngưỡng ms hiện ra', async () => {
    await alertPage.enableSlowResponseAlert(1000);

    // Assert: slow response toggle đang checked
    await expect(alertPage.slowResponseToggle).toBeChecked();

    // Assert: input ngưỡng ms hiện ra và có giá trị đã điền
    await expect(alertPage.slowResponseThreshold).toBeVisible();
    await expect(alertPage.slowResponseThreshold).toHaveValue('1000');
  });

  test('TC-ALERT-04 | Tắt "Response Time chậm" — input ngưỡng biến mất', async ({ page }) => {
    // Bật
    await alertPage.enableSlowResponseAlert(800);
    await expect(alertPage.slowResponseThreshold).toBeVisible();

    // Tắt
    await alertPage.setToggle(alertPage.slowResponseToggle, false);

    // Assert: input threshold biến mất (conditional rendering)
    await expect(alertPage.slowResponseThreshold).not.toBeVisible();
  });

  // ── Channel Configuration Tests ─────────────────────────────────────────────

  test('TC-ALERT-05 | Bật kênh Telegram — input Chat ID hiện ra', async () => {
    await alertPage.setupTelegramChannel('');

    // Chỉ kiểm tra input đã hiện, không cần giá trị
    await expect(alertPage.telegramTargetInput).toBeVisible();
  });

  test('TC-ALERT-06 | Cấu hình kênh Email với địa chỉ email + Lưu thành công', async () => {
    await alertPage.setupEmailChannel('alert@mycompany.com');

    // Assert: input đang chứa đúng giá trị vừa điền
    await expect(alertPage.emailTargetInput).toHaveValue('alert@mycompany.com');

    await alertPage.save();

    // Assert: toast success xuất hiện
    await expect(alertPage.toastSuccess).toBeVisible({ timeout: 10_000 });
  });

  // ── Persistence Test (quan trọng nhất) ─────────────────────────────────────

  test('TC-ALERT-07 | Lưu cấu hình Telegram → Refresh trang → Cấu hình vẫn còn', async ({ page }) => {
    const telegramChatId = '987654321';

    // Step 1: Cấu hình và lưu
    await alertPage.setupTelegramChannel(telegramChatId);
    await alertPage.save();
    await expect(alertPage.toastSuccess).toBeVisible({ timeout: 10_000 });

    // Step 2: Refresh trang
    await alertPage.reload();

    // Step 3: Kiểm tra toggle Telegram vẫn ON
    await expect(alertPage.telegramToggle).toBeChecked();

    // Step 4: Kiểm tra Chat ID vẫn còn sau reload
    const savedValue = await alertPage.getTelegramTarget();
    expect(savedValue).toBe(telegramChatId);
  });

  test('TC-ALERT-08 | Lưu cấu hình Email → Refresh trang → Cấu hình vẫn còn', async () => {
    const emailAddress = 'persist-test@example.com';

    // Cấu hình và lưu
    await alertPage.setupEmailChannel(emailAddress);
    await alertPage.save();
    await expect(alertPage.toastSuccess).toBeVisible({ timeout: 10_000 });

    // Reload và verify
    await alertPage.reload();

    await expect(alertPage.emailToggle).toBeChecked();
    const savedEmail = await alertPage.getEmailTarget();
    expect(savedEmail).toBe(emailAddress);
  });

  test('TC-ALERT-09 | Lưu nhiều cấu hình cùng lúc: triggers + channels → Persist sau reload', async () => {
    const telegramId = '111222333';
    const emailAddr  = 'combined@example.com';

    // Cấu hình triggers
    await alertPage.enableWebsiteDownAlert();
    await alertPage.enableSlowResponseAlert(500);

    // Cấu hình channels
    await alertPage.setupTelegramChannel(telegramId);
    await alertPage.setupEmailChannel(emailAddr);

    // Lưu
    await alertPage.save();
    await expect(alertPage.toastSuccess).toBeVisible({ timeout: 10_000 });

    // Reload và verify tất cả
    await alertPage.reload();

    await expect(alertPage.websiteDownToggle).toBeChecked();
    await expect(alertPage.slowResponseToggle).toBeChecked();
    await expect(alertPage.telegramToggle).toBeChecked();
    await expect(alertPage.emailToggle).toBeChecked();

    expect(await alertPage.getTelegramTarget()).toBe(telegramId);
    expect(await alertPage.getEmailTarget()).toBe(emailAddr);
  });
});
