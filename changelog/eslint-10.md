### Changed
- (public) Linting runs on ESLint 10 and requires TypeScript 6 installed in the project, as well as Node.js 20.19, 22.13 or 24 and newer.
- (public) Linting now reports variables that are never assigned (`no-unassigned-vars`), values overwritten before use (`no-useless-assignment`) and errors rethrown without their original `cause` (`preserve-caught-error`).
