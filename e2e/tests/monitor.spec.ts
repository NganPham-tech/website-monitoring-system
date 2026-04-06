import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { MonitorPage }   from '../pages/MonitorPage';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * TEST SUITE: Monitor Management Flow
 * ──────────────────────────────────────────────────────────────────────────────
 * Các test này dùng storageState từ global.setup.ts (đã authenticated).
 * Luồng: Dashboard → Thêm Monitor → Điền form → Submit → Kiểm tra danh sách
 * ══════════════════════════════════════════════════════════════════════════════
 */

test.describe('Monitor — Quản lý Monitor', () => {
  let dashboard: DashboardPage;
  let monitorPage: MonitorPage;

  test.beforeEach(async ({ page }) => {
    dashboard   = new DashboardPage(page);
    monitorPage = new MonitorPage(page);

    // Bắt đầu từ Dashboard mỗi test
    await dashboard.goto();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────

  test('TC-MON-01 | Tạo monitor mới: Dashboard → Form → Submit → Xuất hiện trong danh sách', async ({ page }) => {
    // Tên duy nhất để tránh xung đột giữa các test run
    const monitorName = `E2E-Monitor-${Date.now()}`;
    const monitorUrl  = 'https://example.com';

    // Step 1: Từ Dashboard click nút Thêm Monitor
    await dashboard.clickAddMonitor();
    await expect(monitorPage.pageHeading).toBeVisible();

    // Step 2: Điền form
    await monitorPage.fillForm({
      name:        monitorName,
      url:         monitorUrl,
      description: 'Tạo tự động bởi Playwright E2E test',
    });

    // Step 3: Submit
    await monitorPage.submit();

    // Step 4: Toast success xuất hiện
    await expect(monitorPage.toastSuccess).toBeVisible({ timeout: 10_000 });

    // Step 5: Redirect về danh sách
    await expect(page).toHaveURL(/\/monitors(?!\/add)/, { timeout: 15_000 });

    // Step 6: Monitor mới hiển thị trong danh sách
    await dashboard.expectMonitorVisible(monitorName);
  });

  test('TC-MON-02 | Navigate: Click Thêm Monitor dẫn đúng tới /monitors/add', async ({ page }) => {
    await dashboard.clickAddMonitor();
    await expect(page).toHaveURL(/\/monitors\/add/);
    await expect(monitorPage.pageHeading).toBeVisible();
  });

  test('TC-MON-03 | Form validation — bỏ trống trường Tên Monitor', async ({ page }) => {
    // Navigate trực tiếp tới form
    await monitorPage.goto();

    // Chỉ điền URL, bỏ trống tên
    await monitorPage.fillUrl('https://example.com');
    await monitorPage.submit();

    // Assert: lỗi validation Tên Monitor hiện ra
    await expect(monitorPage.nameError).toBeVisible();

    // Assert: KHÔNG redirect (vẫn ở form)
    await expect(page).toHaveURL(/\/monitors\/add/);
  });

  test('TC-MON-04 | Form validation — bỏ trống URL', async ({ page }) => {
    await monitorPage.goto();

    await monitorPage.fillName('Test Monitor No URL');
    await monitorPage.submit();

    await expect(monitorPage.urlError).toBeVisible();
    await expect(page).toHaveURL(/\/monitors\/add/);
  });

  test('TC-MON-05 | Dashboard hiển thị danh sách monitors (heading + search bar có mặt)', async () => {
    await expect(dashboard.pageHeading).toBeVisible();
    await expect(dashboard.searchInput).toBeVisible();
    await expect(dashboard.addMonitorButton).toBeVisible();
  });

  test('TC-MON-06 | Tìm kiếm monitor không tồn tại — không crash, hiện trạng thái rỗng', async ({ page }) => {
    await dashboard.searchMonitor('__KHÔNG_TỒN_TẠI_ABC_XYZ__');

    // Assert: trang không crash (không có error boundary hiện)
    await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    // Assert: không còn monitor cards nào khớp (hoặc hiện "không có dữ liệu")
    // Cho phép cả hai trường hợp: danh sách rỗng hoặc text "không có"
    const isEmpty = await page.locator('[class*="empty"], text=không có monitor').isVisible();
    const zeroCards = (await dashboard.monitorCards.count()) === 0;
    expect(isEmpty || zeroCards).toBeTruthy();
  });
});
