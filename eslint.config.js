import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import globals from 'globals'

/** @type {import('eslint').FlatConfigArray} */
export default [
	js.configs.recommended,

	{
		ignores: ['dist/**', 'out-tsc/**'],
		languageOptions: {

			globals: {
				...globals.node,
				...globals.es2021,
				...globals.browser
			}
		}
	},

	// ESLint config file itself (plain JS, no TS parser)
	{
		files: ['eslint.config.js'],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},

	// TypeScript files only
	{
		files: ['**/*.ts', '**/*.d.ts'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2021,
				...globals.browser,
				app: 'readonly',
				dv: 'readonly',
				input: 'readonly'
			},
			parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: process.cwd()
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,

			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_'
				}
			],

			'semi': ['error', 'never'],
			'no-extra-semi': 'error',
			'indent': ['error', 'tab', { "SwitchCase": 1 }],
			'quotes': ['error', 'single'],
			'no-mixed-spaces-and-tabs': 'error',
			'no-tabs': 'off',
		}
	}
]
