/** @type {import("eslint").Linter.Config} */
const config = {
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
	plugins: ['eslint-plugin-no-null', '@typescript-eslint', 'prettier', 'unused-imports'],
	root: true,
	rules: {
		'@typescript-eslint/dot-notation': 'error',
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
		'@typescript-eslint/typedef': [
			'error',
			{
				propertyDeclaration: true,
				memberVariableDeclaration: true,
			},
		],
		'@typescript-eslint/prefer-literal-enum-member': 'error',
		'@typescript-eslint/prefer-enum-initializers': 'error',
		curly: 'error',
		'default-case': 'error',
		'dot-notation': 'off',
		eqeqeq: ['error', 'smart'],
		'id-denylist': ['off', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
		'id-match': 'off',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-console': 'off',
		'no-debugger': 'error',
		'no-empty': 'error',
		'no-empty-function': 'off',
		'no-eval': 'error',
		'no-fallthrough': 'off',
		'no-new-wrappers': 'error',
		'no-null/no-null': 'off',
		'no-redeclare': 'error',
		'no-underscore-dangle': 'off',
		'no-unused-expressions': 'off',
		'no-unused-labels': 'error',
		'no-var': 'error',
		'no-duplicate-imports': 'error',
		radix: 'off',
		'prettier/prettier': ['error'],
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
	},
	extends: ['prettier'],
};

module.exports = config;
