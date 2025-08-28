import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	alias: {
		'~': path.resolve('./'),
	},
	modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/nuxt'],

	googleFonts: {
		families: {
			'Fira Code': [400, 500, 600],
			Inter: [400, 500, 600, 700],
		},
		display: 'swap',
	},

	css: ['~/assets/css/main.css'],

	app: {
		head: {
			title: 'Live Python Coding',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{
					name: 'description',
					content: 'Minimalist platform for writing and executing Python code in real time',
				},
			],
		},
	},
})
