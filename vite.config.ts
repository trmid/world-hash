import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	server: {
		port: 25556
	},
	preview: {
		port: 25557
	}
};

export default config;