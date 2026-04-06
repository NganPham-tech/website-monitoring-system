import { defineConfig, devices } from '@playwright/test';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PLAYWRIGHT CONFIGURATION — Website Monitoring System E2E
 * ──────────────────────────────────────────────────────────────────────────────
 * Tài liệu: https://playwright.dev/docs/test-configuration
 * ══════════════════════════════════════════════════════════════════════════════
 */
export default defineConfig({
    // ── Test Discovery ──────────────────────────────────────────────────────────
    testDir: './e2e/tests',

    // Thư mục chứa screenshots, videos, traces khi test fails
    outputDir: './e2e/test-results',

    // ── Execution Strategy ──────────────────────────────────────────────────────
    // Chạy song song toàn bộ test files để tối ưu tốc độ
    fullyParallel: true,

    // Fail ngay nếu có test.only bị commit lên CI
    forbidOnly: !!process.env.CI,

    // Retry 2 lần khi chạy trên CI để tránh flakiness do network
    retries: process.env.CI ? 2 : 0,

    // CI: 1 worker (tránh race condition trên shared DB), local: tự động theo số CPU
    workers: process.env.CI ? 1 : undefined,

    // ── Reporting ───────────────────────────────────────────────────────────────
    reporter: [
        // HTML report — upload lên GitHub Artifacts sau khi CI chạy xong
        ['html', { outputFolder: 'e2e/playwright-report', open: 'never' }],
        // Terminal output chi tiết từng test
        ['list'],
        // JUnit XML — phục vụ cho các CI system khác nếu cần
        ['junit', { outputFile: 'e2e/test-results/results.xml' }],
    ],

    // ── Shared Settings (áp dụng cho mọi project / browser) ────────────────────
    use: {
        // baseURL đọc từ biến môi trường; mặc định = Vite dev server
        baseURL: process.env.BASE_URL ?? 'http://localhost:3000',

        // Lưu trace (DOM snapshot + network) khi test thất bại → dễ debug
        trace: 'retain-on-failure',

        // Chụp ảnh màn hình khi test thất bại
        screenshot: 'only-on-failure',

        // Quay video khi test thất bại
        video: 'retain-on-failure',

        // Timeout cho mỗi action (click, fill, expect...)
        actionTimeout: 15_000,

        // Timeout cho mỗi navigation
        navigationTimeout: 30_000,
    },

    // ── Projects (multi-browser) ────────────────────────────────────────────────
    projects: [
        // ┌─ SETUP PROJECT ────────────────────────────────────────────────────────┐
        // │ Chạy global.setup.ts DUY NHẤT 1 LẦN, lưu auth state vào               │
        // │ e2e/.auth/user.json — các project khác tái sử dụng state này.          │
        // └────────────────────────────────────────────────────────────────────────┘
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
        },

        // ┌─ CHROMIUM ─────────────────────────────────────────────────────────────┐
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Sử dụng lại auth state → bỏ qua login ở mọi test
                storageState: 'e2e/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // ┌─ FIREFOX ──────────────────────────────────────────────────────────────┐
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'e2e/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // ┌─ WEBKIT (Safari engine) ───────────────────────────────────────────────┐
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                storageState: 'e2e/.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],

    // ── Web Servers (tự động start khi chạy test cục bộ) ───────────────────────
    // Bỏ comment nếu muốn Playwright tự khởi động app:
    //
    // webServer: [
    //   {
    //     command: 'cd backend && npm start',
    //     url: 'http://localhost:5000',
    //     reuseExistingServer: !process.env.CI,
    //     timeout: 120_000,
    //   },
    //   {
    //     command: 'cd frontend && npm run dev',
    //     url: 'http://localhost:3000',
    //     reuseExistingServer: !process.env.CI,
    //     timeout: 120_000,
    //   },
    // ],
});
