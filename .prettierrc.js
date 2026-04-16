/** @type {import("prettier").Config} */
const config = {
	plugins: [
		require.resolve('prettier-plugin-sh'), // plugin path has to be resolved here, because it can't be resolved in projects where @signageos/codestyle is not installed directly (such as running sos-prettier command)
	],
	semi: true,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'all',
	bracketSpacing: true,
	requirePragma: false,
	insertPragma: false,
	proseWrap: 'always',
	arrowParens: 'always',
	quoteProps: 'as-needed',
	printWidth: 140,
	useTabs: true,
	endOfLine: 'auto',
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			options: {
				parser: 'typescript',
			},
		},
		{
			files: ['*.md'],
			options: {
				parser: 'markdown',
			},
		},
		{
			files: ['*.html'],
			options: {
				parser: 'html',
			},
		},
		{
			files: ['*.yml', '*.yaml'],
			options: {
				proseWrap: 'preserve',
				parser: 'yaml',
			},
		},
	],
};

module.exports = config;
