import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		minify: 'esbuild',
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('node modules')) {
						return 'vendor'
					}
				}
			}
		}
	}
});
