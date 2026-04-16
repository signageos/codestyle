# CodeStyle

Code style for services

## Rules

### `sos/changelog`

Lints `CHANGELOG.md` files to enforce the [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) format. It is enabled for
`**/CHANGELOG.md` files using the custom `sos/changelog` language and is auto-fixable where possible (it intentionally does not fix anything
where meaning is ambiguous).

It checks:

- **Preamble** – the file must start with the standard Keep a Changelog / Semantic Versioning header (auto-fixed).
- **Versions** – each released version heading must be `[<semver>] - <date>`, with a valid [semver](http://semver.org/spec/v2.0.0.html)
  version and a valid date (or `unknown`). The `[Unreleased]` heading is recognized as a special version.
- **Sections** – section headings must be one of `Added`, `Fixed`, `Changed`, `Removed`, `Deprecated`, `Security`. Headings can't be
  indented.
- **Entries** – entries in released versions must start with `- ` (auto-fixed for wrong prefixes where possible); entries under
  `[Unreleased]` must start with `+ ` instead. Optional tab indentation is allowed for nesting.
- **Whitespace** – flags irregular (double) whitespace, and requires a trailing empty line after the last entry in a section (auto-fixed).

#### Options

- `allowedSections` (`string[]`) – override the list of permitted section names. Defaults to
  `['Added', 'Fixed', 'Changed', 'Removed', 'Deprecated', 'Security']`.

```js
{
	files: ['**/CHANGELOG.md'],
	language: 'sos/changelog',
	plugins: {
		sos: eslintPluginSos,
	},
	rules: {
		'prettier/prettier': 'off',
		'sos/changelog': ['error', { allowedSections: ['Added', 'Fixed', 'Changed'] }],
	},
}
```
