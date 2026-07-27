import { readFile } from 'node:fs/promises';

export const loadJson = async (path: string): Promise<unknown> => {
	const content = await readFile(path, 'utf8');
	return JSON.parse(content);
};
