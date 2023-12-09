const getCoordinates = async (
	street: string,
	zipCode: number,
	city: string,
): Promise<{ lat: number | undefined; lon: number | undefined }> => {
	const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${street},+${zipCode},+${city}&format=json&polygon=1&addressdetails=1`;
	const nominatimOptions = {
		headers: {
			'User-Agent': 'pulssiposti-api-v1',
		},
	};
	const nominatimResponse = await fetch(nominatimUrl, nominatimOptions);
	const nominatimData = await nominatimResponse.json();
	if (!Array.isArray(nominatimData) || nominatimData.length === 0) {
		return { lat: undefined, lon: undefined };
	}
	const { lat, lon }: { lat: number; lon: number } = nominatimData[0];
	return { lat, lon };
};

export { getCoordinates };
