import {expect, test} from '@playwright/test';

import {fixedTestNow, setFixedTestTime} from './test-clock';

test.beforeEach(async ({page}) => {
  await setFixedTestTime(page);
});

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

test('a traveler turns a discovery into today’s itinerary', async ({page}) => {
  const today = new Date(fixedTestNow);
  const end = new Date(today);
  end.setDate(end.getDate() + 2);

  await page.goto('/ja');
  await page.getByRole('link', {name: 'デモをはじめる'}).click();
  await expect(page.getByRole('heading', {name: '旅のしおり'})).toBeVisible();

  await page.getByRole('link', {name: '新しい旅をつくる'}).first().click();
  await page.getByLabel('旅の名前').fill('E2E ソウル旅行');
  await page.getByLabel('出発日').fill(isoDate(today));
  await page.getByLabel('帰国日').fill(isoDate(end));
  await page.getByRole('button', {name: 'この旅をつくる'}).click();
  await expect(
    page.getByRole('heading', {name: 'E2E ソウル旅行'})
  ).toBeVisible();

  await page.getByRole('link', {name: 'クリップ', exact: true}).click();
  await page
    .getByLabel('見つけたページのURL')
    .fill('https://example.com/e2e-bakery');
  await page.getByRole('button', {name: 'URLをクリップ'}).click();
  await expect(page.getByText('https://example.com/e2e-bakery')).toBeVisible();

  await page.getByRole('tab', {name: '画像'}).click();
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', {name: /画像をクリップ/}).click();
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: 'seongsu.png',
    mimeType: 'image/png',
    buffer: Buffer.from('mock-image')
  });
  await expect(page.getByText('アップロード完了')).toBeVisible();

  const urlCard = page.locator('article').filter({hasText: 'e2e-bakery'});
  await urlCard.getByRole('button', {name: '場所に整理'}).click();
  await page.getByLabel('現地の場所名').fill('서울숲 베이커리');
  await page.getByLabel('日本語の場所名').fill('ソウルの森ベーカリー');
  await page.getByLabel('現地の住所').fill('서울특별시 성동구 성수동1가 1');
  await page.getByLabel('エリア').fill('聖水・ソンス');
  await page.getByRole('button', {name: '場所として保存'}).click();

  await page.getByRole('link', {name: 'スポット', exact: true}).click();
  const placeCard = page
    .locator('article')
    .filter({hasText: 'ソウルの森ベーカリー'});
  await expect(placeCard).toBeVisible();
  await placeCard.getByRole('button', {name: '日程に追加'}).click();
  await page.getByLabel('開始時間').fill('13:30');
  await page.getByRole('button', {name: 'この日に追加'}).click();
  await expect(placeCard).toContainText('DAY 1');
  await expect(placeCard).toContainText('13:30');
  await placeCard.getByRole('button', {name: '日程を編集'}).click();
  await expect(page.getByLabel('開始時間')).toHaveValue('13:30');
  await page.getByLabel('開始時間').fill('14:00');
  await page.getByRole('button', {name: '変更を保存'}).click();
  await expect(placeCard).toContainText('14:00');
  await expect(
    placeCard.getByRole('button', {name: '日程を編集'})
  ).toBeVisible();

  await page.getByRole('link', {name: '今日', exact: true}).click();
  await expect(
    page.getByRole('heading', {name: 'ソウルの森ベーカリー'})
  ).toBeVisible();
  await expect(
    page.getByRole('button', {name: '地図を開く'}).last()
  ).toBeVisible();
});

test('key navigation and error states remain accessible', async ({page}) => {
  await page.goto('/ja/app');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: '本文へ移動'})).toBeFocused();
  await page.getByRole('link', {name: '夏のソウル、3泊4日'}).click();
  await expect(page.getByRole('navigation')).toBeVisible();

  await page.goto('/ja/app/trips/missing/places');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('button', {name: 'もう一度試す'})).toBeVisible();
});
