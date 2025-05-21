/** @type {import("prettier").Config} */
const config = {
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
			files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
			options: {
				parser: 'typescript',
			},
		},
	],
};

module.exports = config;
