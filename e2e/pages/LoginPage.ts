import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PAGE OBJECT MODEL — LoginPage
 * ──────────────────────────────────────────────────────────────────────────────
 * Đóng gói mọi tương tác với trang /login.
 * Các test KHÔNG được dùng locator trực tiếp — chỉ gọi methods của class này.
 *
 * Route: /login
 * Component: frontend/src/components/auth/Login.jsx
 * ══════════════════════════════════════════════════════════════════════════════
 */
export class LoginPage {
  readonly page: Page;

  // ── Locators ────────────────────────────────────────────────────────────────
  // Sử dụng attribute selector (ổn định hơn CSS class, không bị đổi khi redesign)
  readonly emailInput:    Locator;
  readonly passwordInput: Locator;
  readonly rememberMe:    Locator;
  readonly submitButton:  Locator;

  // Error messages (validation client-side)
  readonly emailError:    Locator;
  readonly passwordError: Locator;

  // Toast notification (react-toastify) — dùng role="alert" theo ARIA standard
  readonly toastSuccess:  Locator;
  readonly toastError:    Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput    = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.rememberMe    = page.locator('input[name="rememberMe"]');
    this.submitButton  = page.locator('button[type="submit"]');

    // Validation error text (hiện ra dưới mỗi input)
    this.emailError    = page.locator('text=Email không được để trống')
                             .or(page.locator('text=Email không đúng định dạng'));
    this.passwordError = page.locator('text=Mật khẩu không được để trống')
                             .or(page.locator('text=Mật khẩu phải có ít nhất 6 ký tự'));

    // Toast: react-toastify render thẻ có role="alert"
    this.toastSuccess  = page.locator('[class*="Toastify"] [role="alert"]').filter({ hasText: /thành công/i });
    this.toastError    = page.locator('[class*="Toastify"] [role="alert"]').filter({ hasText: /lỗi|thất bại|sai|không đúng/i });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Điều hướng tới trang login */
  async goto() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/\/login/);
  }

  /** Điền email */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /** Điền password */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Đăng nhập hoàn chỉnh — điền form và submit.
   * @param email    - Email tài khoản
   * @param password - Mật khẩu
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submitButton.click();
  }

  /**
   * Đăng nhập và đợi redirect tới /monitors
   * (Shortcut cho happy path)
   */
  async loginAndWaitForDashboard(email: string, password: string) {
    await this.login(email, password);
    await expect(this.page).toHaveURL(/\/monitors/, { timeout: 15_000 });
  }

  /** Xác nhận trang login đã render xong */
  async waitForReady() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }
}
