import { test, expect } from '@playwright/test';

test('admin can delete a review successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
  
    await page.goto('http://localhost:3000');

    await page.getByRole('button', { name: /menu toggle/i }).click();
    await page.getByText('Review Verify').click()

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: /Louisvanich/i }).click();
    await page.locator('button[title="Delete Review"]').first().click();
    await page.getByRole('button', { name: /Confirm/i }).click();

    await expect(page.locator('text=Review successfully deleted!')).toBeVisible();

});
