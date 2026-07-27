export const isAdmin = (role: string): boolean => {
	if (role == 'admin') {
		return true;
	}
	return false;
};
