import { textLanguage } from './languages/text.mjs';

const plugin = {
	meta: {
		name: '@signageos/eslint-plugin-sos',
		version: '1.0.0',
	},
	languages: {
		text: textLanguage,
	},
	rules: {},
	configs: {},
};

export default plugin;
