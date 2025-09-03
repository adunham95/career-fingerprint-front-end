import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),

		experimental: {
			tracing: {
				server: true
			},

			instrumentation: {
				server: true
			}
		}
	},
	build: {
		sourcemap: true // This enables source map generation
	}
};

export default config;
