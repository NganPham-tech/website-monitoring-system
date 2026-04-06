import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PAGE OBJECT MODEL — AlertSettingsPage
 * ──────────────────────────────────────────────────────────────────────────────
 * Đóng gói trang cấu hình cảnh báo tại /alerts/settings.
 *
 * Route: /alerts/settings
 * Component: frontend/src/pages/admin/AlertSettings.jsx
 * Sub-components:
 *   - TriggerSettings   (websiteDown toggle, slowResponse toggle + threshold)
 *   - ChannelIntegrations (email, telegram, discord, sms toggles + target input)
 *   - SilentModeSettings
 * ══════════════════════════════════════════════════════════════════════════════
 */
export class AlertSettingsPage {
    readonly page: Page;

    // ── Locators — Triggers ─────────────────────────────────────────────────────
    /**
     * Toggle "Cảnh báo khi website down"
     * react-hook-form name = "triggers.websiteDown"
     * Checkbox hidden (sr-only), tương tác qua label wrapper
     */
    readonly websiteDownToggle: Locator;

    /**
     * Toggle "Cảnh báo khi Response Time chậm"
     * react-hook-form name = "triggers.slowResponse.enabled"
     */
    readonly slowResponseToggle: Locator;

    /** Input ngưỡng ms (hiện ra khi slowResponse bật) */
    readonly slowResponseThreshold: Locator;

    // ── Locators — Channels ─────────────────────────────────────────────────────
    /** Toggle kênh Email — name = "channels.email.enabled" */
    readonly emailToggle: Locator;
    /** Input email target (hiện ra khi email bật) */
    readonly emailTargetInput: Locator;

    /** Toggle kênh Telegram — name = "channels.telegram.enabled" */
    readonly telegramToggle: Locator;
    /** Input Telegram Chat ID (hiện ra khi telegram bật) */
    readonly telegramTargetInput: Locator;

    // ── Locators — Actions ──────────────────────────────────────────────────────
    readonly saveButton: Locator;
    readonly toastSuccess: Locator;

    constructor(page: Page) {
        this.page = page;

        // Toggle = checkbox.sr-only + label bọc bên ngoài
        // Selector: tìm checkbox theo name rồi lấy closest label wrapper để click
        // (clicking hidden checkbox trực tiếp = checked; clicking label = toggle)
        this.websiteDownToggle = page.locator('input[name="triggers.websiteDown"]');
        this.slowResponseToggle = page.locator('input[name="triggers.slowResponse.enabled"]');
        this.slowResponseThreshold = page.locator('input[name="triggers.slowResponse.threshold"]');

        this.emailToggle = page.locator('input[name="channels.email.enabled"]');
        this.emailTargetInput = page.locator('input[name="channels.email.target"]');

        this.telegramToggle = page.locator('input[name="channels.telegram.enabled"]');
        this.telegramTargetInput = page.locator('input[name="channels.telegram.target"]');

        this.saveButton = page.getByRole('button', { name: /lưu|save/i }).filter({ hasText: /lưu|save/i });
        this.toastSuccess = page.locator('[class*="Toastify"] [role="alert"]').filter({ hasText: /thành công/i });
    }

    // ── Actions ─────────────────────────────────────────────────────────────────

    async goto() {
        await this.page.goto('/alerts/settings');
        await expect(this.saveButton).toBeVisible({ timeout: 15_000 });
    }

    /**
     * Bật/tắt một toggle bằng checkbox ẩn.
     * Browser không cho click vào sr-only element, nên dùng check/uncheck API.
     */
    async setToggle(toggle: Locator, enabled: boolean) {
        const isChecked = await toggle.isChecked();
        if (isChecked !== enabled) {
            // Dùng dispatchEvent để bypass sr-only visibility restriction
            await toggle.evaluate((el) => (el as HTMLInputElement).click());
        }
    }

    /** Bật toggle website down */
    async enableWebsiteDownAlert() {
        await this.setToggle(this.websiteDownToggle, true);
    }

    /** Tắt toggle website down */
    async disableWebsiteDownAlert() {
        await this.setToggle(this.websiteDownToggle, false);
    }

    /** Bật slow response và nhập ngưỡng ms */
    async enableSlowResponseAlert(thresholdMs: number) {
        await this.setToggle(this.slowResponseToggle, true);
        await expect(this.slowResponseThreshold).toBeVisible();
        await this.slowResponseThreshold.fill(String(thresholdMs));
    }

    /**
     * Cấu hình kênh Telegram.
     * @param chatId - Telegram Chat ID (ví dụ: "123456789")
     */
    async setupTelegramChannel(chatId: string) {
        await this.setToggle(this.telegramToggle, true);
        await expect(this.telegramTargetInput).toBeVisible();
        await this.telegramTargetInput.fill(chatId);
    }

    /**
     * Cấu hình kênh Email.
     * @param email - Địa chỉ email nhận cảnh báo
     */
    async setupEmailChannel(email: string) {
        await this.setToggle(this.emailToggle, true);
        await expect(this.emailTargetInput).toBeVisible();
        await this.emailTargetInput.fill(email);
    }

    /** Click nút Lưu */
    async save() {
        await this.saveButton.click();
        await expect(this.toastSuccess).toBeVisible({ timeout: 10_000 });
    }

    /** Reload trang và chờ save button render lại */
    async reload() {
        await this.page.reload();
        await expect(this.saveButton).toBeVisible({ timeout: 15_000 });
    }

    /** Đọc giá trị hiện tại của input target (sau reload) */
    async getTelegramTarget(): Promise<string> {
        // Input chỉ hiện ra khi toggle đang ON
        await expect(this.telegramTargetInput).toBeVisible();
        return this.telegramTargetInput.inputValue();
    }

    async getEmailTarget(): Promise<string> {
        await expect(this.emailTargetInput).toBeVisible();
        return this.emailTargetInput.inputValue();
    }
}
