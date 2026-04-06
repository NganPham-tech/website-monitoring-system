import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PAGE OBJECT MODEL — DashboardPage (Monitor List)
 * ──────────────────────────────────────────────────────────────────────────────
 * Đóng gói mọi tương tác với trang /monitors (Danh sách monitors).
 * Đây là trang "trung tâm" sau khi đăng nhập.
 *
 * Route: /monitors
 * Component: frontend/src/pages/MonitorListPage.jsx
 * ══════════════════════════════════════════════════════════════════════════════
 */
export class DashboardPage {
  readonly page: Page;

  // ── Locators ────────────────────────────────────────────────────────────────
  /** Tiêu đề trang "Danh sách Monitors" */
  readonly pageHeading: Locator;

  /** Nút "Thêm Monitor" dẫn tới /monitors/add */
  readonly addMonitorButton: Locator;

  /** Thanh tìm kiếm monitor */
  readonly searchInput: Locator;

  /** Danh sách card hiển thị monitors */
  readonly monitorCards: Locator;

  /** Toast thông báo thành công */
  readonly toastSuccess: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading     = page.getByRole('heading', { name: /danh sách monitors/i });
    // Button Thêm Monitor — tìm theo text (chứa chữ "Thêm" hoặc icon +)
    this.addMonitorButton = page.getByRole('link', { name: /thêm monitor/i })
                               .or(page.getByRole('button', { name: /thêm monitor/i }));
    this.searchInput     = page.locator('input[placeholder*="Tìm kiếm monitor"]');
    // MonitorCard render bên trong một container — dùng test-id hoặc class
    this.monitorCards    = page.locator('[class*="MonitorCard"], [data-testid="monitor-card"]');

    this.toastSuccess    = page.locator('[class*="Toastify"] [role="alert"]').filter({ hasText: /thành công/i });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Điều hướng tới trang dashboard */
  async goto() {
    await this.page.goto('/monitors');
    await this.waitForReady();
  }

  /** Chờ trang load xong (heading hiển thị) */
  async waitForReady() {
    await expect(this.pageHeading).toBeVisible({ timeout: 15_000 });
  }

  /** Click nút Thêm Monitor để tới /monitors/add */
  async clickAddMonitor() {
    await this.addMonitorButton.click();
    await expect(this.page).toHaveURL(/\/monitors\/add/);
  }

  /**
   * Tìm kiếm monitor theo tên.
   * @param query - Từ khoá tìm kiếm
   */
  async searchMonitor(query: string) {
    await this.searchInput.fill(query);
    // Debounce 500ms theo code thực tế
    await this.page.waitForTimeout(600);
  }

  /**
   * Lấy card monitor theo tên (text match).
   * Dùng để assert monitor mới đã xuất hiện trong danh sách.
   * @param name - Tên monitor cần tìm
   */
  getMonitorCardByName(name: string): Locator {
    return this.page.locator('[class*="card"], article, [data-testid]').filter({ hasText: name });
  }

  /**
   * Kiểm tra monitor có xuất hiện trong danh sách chưa (bằng text trên trang).
   * Fallback khi không có data-testid cụ thể — tìm text bất kỳ.
   */
  async expectMonitorVisible(name: string) {
    await expect(this.page.getByText(name, { exact: false })).toBeVisible({ timeout: 10_000 });
  }
}
