import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * TEST SUITE: Authentication Flow
 * ──────────────────────────────────────────────────────────────────────────────
 * Kiểm tra luồng đăng nhập / đăng xuất — các test này KHÔNG dùng storageState
 * vì bản thân chúng là để test màn hình login.
 *
 * Để override storageState (đặt lại về unauthenticated), dùng:
 *   test.use({ storageState: { cookies: [], origins: [] } });
 * ══════════════════════════════════════════════════════════════════════════════
 */

// ── Reset auth state: test này cần trang login, không dùng storageState ────────
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Auth — Đăng nhập', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForReady();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────

  test('TC-AUTH-01 | Đăng nhập thành công với thông tin hợp lệ', async ({ page }) => {
    const email    = process.env.TEST_EMAIL    ?? 'admin@example.com';
    const password = process.env.TEST_PASSWORD ?? 'Admin@123456';

    // Act: điền form và submit
    await loginPage.login(email, password);

    // Assert 1: redirect tới /monitors
    await expect(page).toHaveURL(/\/monitors/, { timeout: 15_000 });

    // Assert 2: user đã ở trong authenticated state (không thấy form login nữa)
    await expect(loginPage.emailInput).not.toBeVisible();
  });

  test('TC-AUTH-02 | Đăng nhập thất bại — sai mật khẩu', async ({ page }) => {
    const email = process.env.TEST_EMAIL ?? 'admin@example.com';

    // Act: nhập mật khẩu sai
    await loginPage.login(email, 'SatMatKhauSai@999');

    // Assert 1: KHÔNG redirect (vẫn ở /login)
    await expect(page).toHaveURL(/\/login/);

    // Assert 2: Toast error xuất hiện với nội dung báo lỗi
    await expect(loginPage.toastError).toBeVisible({ timeout: 10_000 });
  });

  test('TC-AUTH-03 | Validation client-side — bỏ trống email', async () => {
    // Act: click submit mà không điền gì
    await loginPage.submitButton.click();

    // Assert: thông báo lỗi email hiện ra
    await expect(loginPage.emailError).toBeVisible();
  });

  test('TC-AUTH-04 | Validation client-side — bỏ trống mật khẩu', async () => {
    // Act: chỉ điền email, bỏ trống password
    await loginPage.fillEmail('test@example.com');
    await loginPage.submitButton.click();

    // Assert: thông báo lỗi password hiện ra
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('TC-AUTH-05 | Validation client-side — email sai định dạng', async ({ page }) => {
    // Act: nhập email không hợp lệ
    await loginPage.fillEmail('not-an-email');
    await loginPage.fillPassword('Password123!');
    await loginPage.submitButton.click();

    // Assert: thông báo lỗi format email
    await expect(page.locator('text=Email không đúng định dạng')).toBeVisible();
  });

  test('TC-AUTH-06 | Validation client-side — mật khẩu quá ngắn (< 6 ký tự)', async ({ page }) => {
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('123');
    await loginPage.submitButton.click();

    await expect(page.locator('text=Mật khẩu phải có ít nhất 6 ký tự')).toBeVisible();
  });
});
