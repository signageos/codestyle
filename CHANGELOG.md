# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Mocha eslint plugin

## [2.0.3] - 2025-06-06
### Fixed
- fix jsdoc cast formatting
- disable capitalized-comments
- make @typescript-eslint/member-ordering less strict

## [2.0.2] - 2025-05-26
### Fixed
- lint JavaScript files properly

## [2.0.1] - 2025-05-23
### Fixed
- disabled `unused-imports/no-unused-vars` in favor of `@typescript-eslint/no-unused-vars`, ignoring `_`

## [2.0.0] - 2025-05-21
### Fixed
- disabled `max-len`, `indent`, `comma-dangle` in favor of prettier

### Added
- `unused-imports` plugin
- `eslint.config.mjs` modern flat-style ESlint config

### Removed
- `tslint.json` removed support for TSlint
- `.eslintrc.js` removed ESlint legacy config
- dropped support for Node 16

### Changed
- `ESlint v8.21.0` is now minimal requirement
- `plugins` are imported directly
- `env` is replaced with `languageOptions.globals`
- `parserOptions` moved under `languageOptions`
- `extends` is replaced with direct imports from the extended configs
- `ignores` replaces `ignorePatterns`

## [1.0.0] - 2025-04-28
### Added
- Flat-style config `eslint.config.mjs`

### Changed
- Project dependency update
- Package supports Node 20

## [0.4.0] - 2024-09-17
### Added
- `@typescript-eslint/no-floating-promises` for eslint to prevent missing await on promises

## [0.3.0] - 2024-04-17
### Added
- Base tsconfig `tsconfig-strict.json`

## [0.2.2] - 2024-03-06
### Fixed
- Added `endOfLine: auto` Prettier rule to improve compatibility with Windows

## [0.2.1] - 2024-02-09
### Fixed
- More precise member ordering rule

## [0.2.0] - 2024-01-23
### Fixed
- Fix eslint linting in the repo
- Fix type checking in the repo
- Disable duplicit rules
- Disable no-redeclare rule
- Allow class member functions without explicit type definition
### Added
- Stricter typescript enum checking

## [0.1.1] - 2023-12-14
### Fixed
- Fixed registry url
- Updated eslint and prettier

## [0.1.0] - 2023-12-05
### Added
- Standard release process
