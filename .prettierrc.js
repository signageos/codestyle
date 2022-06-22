module.exports = {
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
	printWidth: 120,
	tabWidth: 4,
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
			options: {
				parser: 'typescript',
			},
		},
	],
};
