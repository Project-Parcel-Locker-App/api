const getCoordinates = async (
	street: string,
	zipCode: number,
	city: string,
) => {
	const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${street},+${zipCode},+${city}&format=json&polygon=1&addressdetails=1`;
	// Set application name to avoid getting blocked by Nominatim
	const nominatimOptions = {
		headers: {
			'User-Agent': 'pulssiposti-api-v1',
		},
	};
	const nominatimResponse = await fetch(nominatimUrl, nominatimOptions);
	const nominatimData = await nominatimResponse.json();
	const { lat, lon } = nominatimData[0];
	return { lat, lon };
};

export { getCoordinates };
