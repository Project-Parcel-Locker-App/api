// Generates a random code of 4 digits for the parcel
const generateParcelCode = () => {
	return Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, '0');
};

export { generateParcelCode };
