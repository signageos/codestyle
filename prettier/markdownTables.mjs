import * as markdown from 'prettier/plugins/markdown';
import { builders, printer } from 'prettier/doc';

/** @type {Record<string, string>} */
const ALIGN = { left: ':--', right: '--:', center: ':-:' };

const mdast = markdown.printers.mdast;

/** @type {import('prettier').Plugin['options']} */
export const options = {
	markdownTables: {
		type: 'choice',
		category: 'Markdown',
		default: 'aligned',
		description: 'How to print markdown tables.',
		choices: [
			{ value: 'aligned', description: 'Pad every cell to its column width.' },
			{ value: 'compact', description: 'Separate cells by a single space, without padding.' },
		],
	},
};

export const parsers = Object.fromEntries(
	Object.entries(markdown.parsers).map(([name, parser]) => [name, { ...parser, astFormat: 'sos-mdast' }]),
);

/** @type {import('prettier').Plugin['printers']} */
export const printers = {
	'sos-mdast': {
		...mdast,
		print(path, printOptions, print) {
			if (path.node.type !== 'table' || printOptions.markdownTables !== 'compact') {
				return mdast.print(path, printOptions, print);
			}
			/** @param {import('prettier').Doc} doc */
			const flat = (doc) => printer.printDocToString(doc, { ...printOptions, printWidth: Infinity }).formatted.trim();
			const rows = path.map(() => `| ${path.map(() => flat(print(path)), 'children').join(' | ')} |`, 'children');
			/** @type {(string | null)[]} */
			const align = path.node.align;
			rows.splice(1, 0, `| ${align.map((column) => (column && ALIGN[column]) ?? '---').join(' | ')} |`);
			return builders.join(builders.hardline, rows);
		},
	},
};
