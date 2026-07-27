import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';

export const copy = async (src: string, dest: string): Promise<void> => {
	const content = await readFile(src, 'utf8');
	await writeFile(dest, content);
};
