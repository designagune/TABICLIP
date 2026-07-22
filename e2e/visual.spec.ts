import {expect, test} from '@playwright/test';

import {setFixedTestTime} from './test-clock';

test.describe('mobile visual regression', () => {
  test.beforeEach(async ({page}) => {
    await setFixedTestTime(page);
  });

  test('collection inbox', async ({page}) => {
    await page.goto('/ja/app/trips/demo-trip/inbox');
    await expect(page.getByRole('heading', {name: 'クリップ'})).toBeVisible();
    await expect(page).toHaveScreenshot('collection-mobile.png', {
      fullPage: true
    });
  });

  test('places grouped by region', async ({page}) => {
    await page.goto('/ja/app/trips/demo-trip/places');
    await expect(page.getByRole('heading', {name: 'スポット'})).toBeVisible();
    await expect(page).toHaveScreenshot('places-mobile.png', {fullPage: true});
  });

  test('itinerary timeline', async ({page}) => {
    await page.goto('/ja/app/trips/demo-trip/schedule');
    await expect(page.getByRole('heading', {name: '日程'})).toBeVisible();
    await expect(page).toHaveScreenshot('itinerary-mobile.png', {
      fullPage: true
    });
  });

  test('travel mode', async ({page}) => {
    await page.goto('/ja/app/trips/demo-trip/today');
    await expect(page.getByRole('heading', {name: '今日の旅'})).toBeVisible();
    await expect(page).toHaveScreenshot('travel-mode-mobile.png', {
      fullPage: true
    });
  });
});
