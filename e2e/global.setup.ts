import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * GLOBAL SETUP — Đăng nhập 1 lần, lưu storageState cho toàn bộ test suite
 * ──────────────────────────────────────────────────────────────────────────────
 * Best Practice: Thay vì mỗi test tự đăng nhập (chậm, dễ flaky), ta chỉ login
 * 1 lần duy nhất ở đây, lưu cookies + localStorage vào file JSON.
 * Các test khác load file này → đã ở trạng thái authenticated ngay lập tức.
 *
 * Tài liệu: https://playwright.dev/docs/auth#basic-shared-account-in-all-tests
 * ══════════════════════════════════════════════════════════════════════════════
 */

/** Đường dẫn lưu auth state — được gitignore */
const AUTH_FILE = path.join(__dirname, '.auth', 'user.json');

setup('authenticate as default user', async ({ page }) => {
    // Đảm bảo thư mục .auth/ tồn tại
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // ── Bước 1: Điều hướng tới trang đăng nhập ──────────────────────────────
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // ── Bước 2: Điền thông tin đăng nhập từ biến môi trường ─────────────────
    // Cấu hình trong CI: thêm TEST_EMAIL và TEST_PASSWORD vào GitHub Secrets
    const email = process.env.TEST_EMAIL ?? 'admin@example.com';
    const password = process.env.TEST_PASSWORD ?? 'Admin@123456';

    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);

    // ── Bước 3: Submit form ──────────────────────────────────────────────────
    await page.locator('button[type="submit"]').click();

    // ── Bước 4: Xác nhận đăng nhập thành công (redirect tới /monitors) ───────
    await expect(page).toHaveURL(/\/monitors/, { timeout: 15_000 });

    // ── Bước 5: Lưu toàn bộ cookies + localStorage vào file ─────────────────
    // Playwright serialize context state → tái sử dụng trong các test khác
    await page.context().storageState({ path: AUTH_FILE });

    console.log(`✅ Global setup: Auth state saved to ${AUTH_FILE}`);
});
