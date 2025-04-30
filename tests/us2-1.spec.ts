import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/api/auth/signin');
  await page.fill('input[name="email"]', 'user@gmail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');
});

test('customer can submit a review successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/review/6800ab45f3ba9b608b7eed0e');
  await page.waitForLoadState('networkidle');

  await page.fill('#name', 'อารัน');

  const rating = page.getByTestId('rating-stars');
  await rating.hover();
  const box = await rating.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  }

  await page.fill('#comment', 'หรอยนัดแต่หว้า');

  page.once('dialog', async (dialog) => {
    console.log('Alert text:', dialog.message());
    
    expect(dialog.message()).toContain('Thank for review our Restaurant!');

    await dialog.accept();
  });

  await page.click('button[type="submit"]');
});

test('customer submits review without comment', async ({ page }) => {
  await page.goto('http://localhost:3000/review/6800ab45f3ba9b608b7eed0e');
  await page.waitForLoadState('networkidle');

  await page.fill('#name', 'อารัน');

  const rating = page.getByTestId('rating-stars');
  await rating.hover();
  const box = await rating.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  }

  page.once('dialog', async (dialog) => {
    console.log('Alert text:', dialog.message());
    
    expect(dialog.message()).toContain('Please fill all field');

    await dialog.accept();
  });

  await page.click('button[type="submit"]');
});

test('customer submits review without name', async ({ page }) => {
  await page.goto('http://localhost:3000/review/6800ab45f3ba9b608b7eed0e');
  await page.waitForLoadState('networkidle');

  const rating = page.getByTestId('rating-stars');
  await rating.hover();
  const box = await rating.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  }
  
  await page.fill('#comment', 'มันเป็นตาแซ่บ แซ่บบั่กคัก');

  page.once('dialog', async (dialog) => {
    console.log('Alert text:', dialog.message());
    
    expect(dialog.message()).toContain('Please fill all field');

    await dialog.accept();
  });

  await page.click('button[type="submit"]');
});
