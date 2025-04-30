import { test, expect } from '@playwright/test';

test('manager can see customer reviews', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin');
    await page.fill('input[name="email"]', 'jeho@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/restaurant/6800ac02f3ba9b608b7eed11');
    await page.getByRole('button', { name: /View Reviews/i }).click();
    
    await expect(page.getByRole('heading', { name: /Customer Reviews/i })).toBeVisible();

    const reviewCards = page.locator('div').filter({ hasText: 'Review ID:' });
    await expect(reviewCards.first()).toBeVisible();
});

