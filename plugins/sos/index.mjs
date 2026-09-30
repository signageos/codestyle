import { changelogLanguage } from './languages/changelog/changelog.mjs';
import { changelogFragmentLanguage } from './languages/changelog/fragment.mjs';
import { textLanguage } from './languages/text.mjs';
import { changelogRule } from './rules/changelog.mjs';
import { changelogFragmentRule } from './rules/changelogFragment.mjs';

const plugin = {
	meta: {
		name: '@signageos/eslint-plugin-sos',
		version: '1.0.0',
	},
	languages: {
		text: textLanguage,
		changelog: changelogLanguage,
		'changelog-fragment': changelogFragmentLanguage,
	},
	rules: {
		changelog: changelogRule,
		'changelog-fragment': changelogFragmentRule,
	},
	configs: {},
};

export default plugin;
