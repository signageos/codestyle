export const pick = (flag: boolean): number => {
	let value = 1;
	value = flag ? 2 : 3;
	return value;
};
