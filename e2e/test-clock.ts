import type {Page} from '@playwright/test';

export const fixedTestNow = new Date('2026-07-21T09:00:00+09:00');

export async function setFixedTestTime(page: Page): Promise<void> {
  await page.clock.setFixedTime(fixedTestNow);
}
