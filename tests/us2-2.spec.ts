import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin');
    await page.fill('input[name="email"]', 'user@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
});

test('customer can see recommended dishes', async ({ page }) => {
  await page.goto('http://localhost:3000/restaurant/6800ab45f3ba9b608b7eed0e');
 
  await expect(page.getByRole('heading', { name: /Recommended Menu/i })).toBeVisible();

  const recommendedItems = page.locator('div').filter({ hasText: 'Recommended' });
  
  await expect(recommendedItems.first()).toBeVisible();
});
