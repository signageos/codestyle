# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Entries should be short and human-readable; for longer entries, use an indented list.

`Changed` and `Removed` entries should be used only for breaking changes to the outward-facing API.

## [Unreleased]

## [2.4.0] - 2026-07-27
### Added
- (public) Added sos/changelog language and rules

## [2.3.0] - 2026-04-16
### Added
- (public) Add support for linting `.sh` and `Dockerfile` files
- (public) Add `sos-prettier` command for linting non-JS projects (using `npx sos-prettier --package=@signageos/codestyle`)

### Fixed
- (public) Remove `docker-compose.yml` from ignored files

## [2.2.1] - 2026-04-15
### Fixed
- (public) Allow duplicate keys in `package.json` to allow multiple "//" keys for comments

## [2.2.0] - 2026-04-09
### Added
- (public) Lint .yaml, .yml, .html and .md files with eslint

## [2.1.2] - 2026-04-07
### Fixed
- (public) Fix eslint.config.d.mjs type definition

## [2.1.1] - 2026-04-01
### Fixed
- (public) Update dependencies
- (public) Allow declare module statements
- (public) Add .d.ts files for js files in this package

## [2.1.0] - 2025-09-02
### Added
- (public) Mocha eslint plugin

## [2.0.3] - 2025-06-06
### Fixed
- (public) fix jsdoc cast formatting
- (public) disable capitalized-comments
- (public) make @typescript-eslint/member-ordering less strict

## [2.0.2] - 2025-05-26
### Fixed
- (public) lint JavaScript files properly

## [2.0.1] - 2025-05-23
### Fixed
- (public) disabled `unused-imports/no-unused-vars` in favor of `@typescript-eslint/no-unused-vars`, ignoring `_`

## [2.0.0] - 2025-05-21
### Fixed
- (public) disabled `max-len`, `indent`, `comma-dangle` in favor of prettier

### Added
- (public) `unused-imports` plugin
- (public) `eslint.config.mjs` modern flat-style ESlint config

### Removed
- (public) `tslint.json` removed support for TSlint
- (public) `.eslintrc.js` removed ESlint legacy config
- (public) dropped support for Node 16

### Changed
- (public) `ESlint v8.21.0` is now minimal requirement
- (public) `plugins` are imported directly
- (public) `env` is replaced with `languageOptions.globals`
- (public) `parserOptions` moved under `languageOptions`
- (public) `extends` is replaced with direct imports from the extended configs
- (public) `ignores` replaces `ignorePatterns`

## [1.0.0] - 2025-04-28
### Added
- (public) Flat-style config `eslint.config.mjs`

### Changed
- (public) Project dependency update
- (public) Package supports Node 20

## [0.4.0] - 2024-09-17
### Added
- (public) `@typescript-eslint/no-floating-promises` for eslint to prevent missing await on promises

## [0.3.0] - 2024-04-17
### Added
- (public) Base tsconfig `tsconfig-strict.json`

## [0.2.2] - 2024-03-06
### Fixed
- (public) Added `endOfLine: auto` Prettier rule to improve compatibility with Windows

## [0.2.1] - 2024-02-09
### Fixed
- (public) More precise member ordering rule

## [0.2.0] - 2024-01-23
### Fixed
- (internal) Fix eslint linting in the repo
- (internal) Fix type checking in the repo
- (public) Disable duplicit rules
- (public) Disable no-redeclare rule
- (public) Allow class member functions without explicit type definition

### Added
- (public) Stricter typescript enum checking

## [0.1.1] - 2023-12-14
### Fixed
- (internal) Fixed registry url
- (public) Updated eslint and prettier

## [0.1.0] - 2023-12-05
### Added
- (internal) Standard release process
