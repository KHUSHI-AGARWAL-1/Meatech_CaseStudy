import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.{ts,tsx}'],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100
            },
            exclude: [
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/types.ts',
                'src/main.tsx',
                'src/vite-env.d.ts',
                'src/mocks/**',
                'src/test/**',
                '**/*.config.*'
            ]
        }
    }
});
