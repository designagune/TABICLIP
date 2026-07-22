import path from 'node:path';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {alias: {'@': path.resolve(__dirname, './src')}},
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'storybook-static/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/shared/date/**/*.ts',
        'src/lib/data-mode.ts',
        'src/features/**/schemas/*.ts',
        'src/features/**/stores/*.ts',
        'src/features/trips/mappers/*.ts',
        'src/features/trips/repositories/mock-*.ts',
        'src/features/trips/queries/trip-keys.ts',
        'src/shared/platform/browser-platform-service.ts'
      ],
      exclude: [
        'src/lib/supabase/database.types.ts',
        '**/*.stories.*',
        '**/index.ts'
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 65,
        branches: 60
      }
    }
  }
});
