type Person = { address?: { city?: string } };

export const cityOf = (person: Person): string | undefined => person.address?.city;
