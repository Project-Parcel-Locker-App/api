const generateRandomParcelSize = () => {
	const sizes = ['S', 'M', 'L', 'XL'];
	const randomIndex = Math.floor(Math.random() * sizes.length);
	return sizes[randomIndex] as 'S' | 'M' | 'L' | 'XL';
};

const generateRandomSpecialInstructions = (): string | null => {
	const instructionsOptions = [
		'Fragile',
		'Handle with care',
		'Express delivery',
		'Do not bend',
		'This side up',
		'Perishable',
		'Top secret',
		'Caution: Glass inside',
		'Handle like eggs',
		'Confidential',
		'Priority handling',
		'Keep refrigerated',
		'Avoid direct sunlight',
		'Handle gently',
		null,
	];
	const randomIndex = Math.floor(Math.random() * instructionsOptions.length);
	return instructionsOptions[randomIndex];
};

const generateRandomStatus = (): string | null => {
	const statuses = [
		'pending',
		'in-transit',
		null,
	];
	const randomIndex = Math.floor(Math.random() * statuses.length);
	return statuses[randomIndex];
}

export { generateRandomParcelSize, generateRandomSpecialInstructions, generateRandomStatus };
