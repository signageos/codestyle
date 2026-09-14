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

### `sos/changelog-fragment`

Lints `changelog/<feature>.md` fragment files — the per-branch files a fragment workflow writes entries to instead of editing `CHANGELOG.md`
directly, later spliced into a version by [`@signageos/changelog`](https://www.npmjs.com/package/@signageos/changelog)'s `appendSections`.
It is enabled for `**/changelog/*.md` files using the custom `sos/changelog-fragment` language and checks the same rules as `sos/changelog`,
minus the ones that only apply to a whole `CHANGELOG.md` (preamble, version headings, version order):

- **Sections** – section headings must be one of `Added`, `Fixed`, `Changed`, `Removed`, `Deprecated`, `Security`. Headings can't be
  indented.
- **Entries** – entries must start with `- ` (auto-fixed for wrong prefixes where possible) and one of the configured entry prefixes, e.g.
  `(public)`/`(internal)`. Optional tab indentation is allowed for nesting.
- **Whitespace** – flags irregular (double) whitespace, and requires a trailing empty line after the last entry in a section (auto-fixed).

#### Options

- `allowedSections` (`string[]`) – override the list of permitted section names. Defaults to
  `['Added', 'Fixed', 'Changed', 'Removed', 'Deprecated', 'Security']`.
- `entryPrefixes` (`string[]`) – override the list of allowed entry prefixes. Defaults to `['(public)', '(internal)']`. Pass `[]` to disable
  the check.

```js
{
	files: ['**/changelog/*.md'],
	language: 'sos/changelog-fragment',
	plugins: {
		sos: eslintPluginSos,
	},
	rules: {
		'prettier/prettier': 'off',
		'sos/changelog-fragment': 'error',
	},
}
```
