// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
	// Base ignore patterns
	{
		ignores: [
			'coverage/*',
			'node_modules/',
			'CHANGELOG.md',
			'.prettierignore',
			'docker-compose.yml',
			'patches/*',
			'helm/*',
			'dist/**/*',
			'*.min.js',
		],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	{
		files: ['**/*.json'],
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off',
			'prettier/prettier': 'error',
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.mjs'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tseslint.parser,
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: '.',
			},
			globals: {
				browser: 'readonly',
				node: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			prettier: eslintPluginPrettier,
			'unused-imports': eslintPluginUnusedImports,
		},
		rules: {
			'@typescript-eslint/dot-notation': 'error',
			'@typescript-eslint/no-empty-function': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			'@typescript-eslint/quotes': 'off',
			'@typescript-eslint/typedef': 'off',
			'@typescript-eslint/prefer-literal-enum-member': 'error',
			'@typescript-eslint/prefer-enum-initializers': 'error',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-misused-spread': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/prefer-optional-chain': 'error',
			curly: 'error',
			'default-case': 'error',
			'dot-notation': 'off',
			eqeqeq: ['error', 'smart'],
			'id-denylist': ['off', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
			'id-match': 'off',
			'no-bitwise': 'error',
			'no-caller': 'error',
			'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
			'no-debugger': 'error',
			'no-empty': 'error',
			'no-empty-function': 'off',
			'no-eval': 'error',
			'no-fallthrough': 'off',
			'no-new-wrappers': 'error',
			'no-undef': 'off',
			'no-underscore-dangle': 'off',
			'no-unused-expressions': 'off',
			'no-unused-labels': 'error',
			'no-var': 'error',
			'no-duplicate-imports': 'error',
			radix: 'off',
			'prettier/prettier': ['error'],
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': 'off',
			'max-len': 'off',
			indent: 'off',
			'comma-dangle': 'off',
			'@typescript-eslint/member-ordering': [
				'error',
				{
					default: [
						'public-field',
						'private-field',
						'field',
						'constructor',
						'public-accessor',
						'private-accessor',
						'accessor',
						'public-method',
						'private-method',
						'method',
					],
				},
			],
			'capitalized-comments': 'off',
		},
	},
]);
