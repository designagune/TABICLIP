export const brand = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'TABICLIP',
  shortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME ?? 'TABICLIP',
  description:
    '旅先で見つけた「行きたい」を、忘れない旅程に変えるトラベルクリップ。'
} as const;
