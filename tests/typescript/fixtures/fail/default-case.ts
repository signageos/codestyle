export const describe = (value: number): string => {
	switch (value) {
		case 0:
			return 'zero';
		case 1:
			return 'one';
	}
	return 'other';
};
