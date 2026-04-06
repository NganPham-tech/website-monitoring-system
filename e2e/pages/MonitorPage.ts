import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PAGE OBJECT MODEL — MonitorPage (Add Monitor Form)
 * ──────────────────────────────────────────────────────────────────────────────
 * Đóng gói form tạo monitor tại /monitors/add.
 *
 * Route: /monitors/add
 * Component: frontend/src/pages/AddMonitor.jsx
 * Sub-components:
 *   - ProtocolEngineFields  (protocol, interval, timeout, retries, locations)
 *   - IdentificationFields  (name, url, description)
 *   - AlertSettingsFields
 * ══════════════════════════════════════════════════════════════════════════════
 */
export class MonitorPage {
    readonly page: Page;

    // ── Locators ────────────────────────────────────────────────────────────────
    readonly pageHeading: Locator;

    // IdentificationFields
    readonly nameInput: Locator;
    readonly urlInput: Locator;
    readonly descInput: Locator;

    // ProtocolEngineFields
    readonly protocolSelect: Locator;
    readonly intervalSelect: Locator;

    // Action buttons
    readonly submitButton: Locator;
    readonly cancelButton: Locator;

    // Error messages
    readonly nameError: Locator;
    readonly urlError: Locator;

    // Toast
    readonly toastSuccess: Locator;
    readonly toastError: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /thêm monitor mới/i });

        // IdentificationFields — input[name] từ react-hook-form register
        this.nameInput = page.locator('input[name="name"]');
        this.urlInput = page.locator('input[name="url"]');
        this.descInput = page.locator('textarea[name="description"]');

        // ProtocolEngineFields — select element cho protocol và interval
        this.protocolSelect = page.locator('select[name="protocol"]');
        this.intervalSelect = page.locator('select[name="interval"]');

        // Nút Submit — loại button type="submit" trong form
        this.submitButton = page.locator('button[type="submit"]').filter({ hasText: /tạo monitor|lưu|thêm/i });

        // Nút Huỷ — dẫn về /monitors
        this.cancelButton = page.getByRole('button', { name: /huỷ|cancel/i })
            .or(page.getByRole('link', { name: /huỷ|cancel/i }));

        this.nameError = page.locator('text=Vui lòng nhập tên monitor')
            .or(page.locator('p').filter({ hasText: /tên monitor/i }));
        this.urlError = page.locator('p').filter({ hasText: /url|địa chỉ/i });

        this.toastSuccess = page.locator('[class*="Toastify"] [role="alert"]').filter({ hasText: /thành công/i });
        this.toastError = page.locator('[class*="Toastify"] [role="alert"]').filter({ hasText: /lỗi/i });
    }

    // ── Actions ─────────────────────────────────────────────────────────────────

    /** Điều hướng tới form thêm monitor */
    async goto() {
        await this.page.goto('/monitors/add');
        await expect(this.pageHeading).toBeVisible({ timeout: 10_000 });
    }

    /** Điền tên monitor */
    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

    /** Điền URL */
    async fillUrl(url: string) {
        await this.urlInput.fill(url);
    }

    /** Điền mô tả */
    async fillDescription(desc: string) {
        await this.descInput.fill(desc);
    }

    /**
     * Điền toàn bộ form với dữ liệu tối thiểu bắt buộc.
     * @param data - Object chứa name, url và mô tả tuỳ chọn
     */
    async fillForm(data: { name: string; url: string; description?: string }) {
        await this.fillName(data.name);
        await this.fillUrl(data.url);
        if (data.description) {
            await this.fillDescription(data.description);
        }
    }

    /** Submit form */
    async submit() {
        await this.submitButton.click();
    }

    /**
     * Điền form và submit, đợi redirect về /monitors.
     * Dùng cho happy path test.
     */
    async createMonitorAndExpectSuccess(data: { name: string; url: string; description?: string }) {
        await this.fillForm(data);
        await this.submit();

        // Đợi toast success xuất hiện
        await expect(this.toastSuccess).toBeVisible({ timeout: 10_000 });

        // Đợi redirect về trang danh sách
        await expect(this.page).toHaveURL(/\/monitors(?!\/add)/, { timeout: 15_000 });
    }
}
