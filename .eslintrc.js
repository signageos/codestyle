module.exports = {
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		createDefaultProgram: true,
	},
	plugins: ['eslint-plugin-no-null', '@typescript-eslint', 'prettier'],
	root: true,
	rules: {
		'@typescript-eslint/dot-notation': 'error',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false,
				},
			},
		],
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-shadow': [
			'error',
			{
				hoist: 'all',
			},
		],
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/quotes': 'off',
		'@typescript-eslint/semi': ['error', 'always'],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/typedef': [
			'error',
			{
				propertyDeclaration: true,
				memberVariableDeclaration: true,
			},
		],
		'brace-style': ['error', '1tbs'],
		'comma-dangle': ['error', 'always-multiline'],
		curly: 'error',
		'default-case': 'error',
		'dot-notation': 'error',
		'eol-last': 'error',
		eqeqeq: ['error', 'smart'],
		'id-denylist': ['off', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
		'id-match': 'off',
		'max-len': [
			'error',
			{
				code: 140,
				tabWidth: 1,
			},
		],
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-console': 'off',
		'no-debugger': 'error',
		'no-empty': 'error',
		'no-empty-function': 'error',
		'no-eval': 'error',
		'no-fallthrough': 'off',
		'no-multiple-empty-lines': 'error',
		'no-new-wrappers': 'error',
		'no-null/no-null': 'off',
		'no-redeclare': 'error',
		'no-trailing-spaces': 'error',
		'no-underscore-dangle': 'off',
		'no-unused-expressions': 'error',
		'no-unused-labels': 'error',
		'no-var': 'error',
		'no-duplicate-imports': 'error',
		quotes: 'off',
		radix: 'off',
		semi: 'error',
		'prettier/prettier': ['error'],
	},
	extends: ['prettier'],
};
