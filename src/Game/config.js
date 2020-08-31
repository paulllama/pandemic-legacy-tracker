export const INFECTION_AMOUNTS = [2, 2, 2, 3, 3, 4, 4]
export const MAX_DECIMAL_PLACES = 2
export const NUM_PREDICTIONS = 3

export const CITY_COLOR = {
	RED: 'red',
	BLUE: 'blue',
	BLACK: 'black',
	YELLOW: 'yellow',
}

export const CITY_NAMES_BY_COLOR = {
	[CITY_COLOR.RED]: [
		'Beijing',
		'Seoul',
		'Shanghai',
		'Hong Kong',
		'Tokyo',
		'Osaka',
		'Taipei',
		'Bangkok',
		'Ho Chi Minh City',
		'Jakarta',
		'Manila',
		'Sydney',
	],
	[CITY_COLOR.BLUE]: [
		'San Francisco',
		'Chicago',
		'Montreal',
		'New York',
		'Atlanta',
		'Washington',
		'Madrid',
		'London',
		'Paris',
		'Essen',
		'Milan',
		'St. Petersburg',
	],
	[CITY_COLOR.BLACK]: [
		'Los Angeles',
		'Mexico City',
		'Miami',
		'Bogota',
		'Lima',
		'Sao Paulo',
		'Buenos Aires',
		'Santiago',
		'Lagos',
		'Kinshasa',
		'Khartoum',
		'Johannesburg',
	],
	[CITY_COLOR.YELLOW]: [
		'Algiers',
		'Cairo',
		'Baghdad',
		'Istanbul',
		'Moscow',
		'Tehran',
		'Delhi',
		'Kolkata',
		'Chennai',
		'Mumbai',
		'Karachi',
		'Riyadh',
	],
}

export const SEASON_1_CITIES = Object.entries(CITY_NAMES_BY_COLOR)
	.map(
		([color, cities]) => cities.map(
			name => ({
				name,
				color,
				frequency: 1,
			})
		)
	)
	.reduce((cities, citiesForColor) => [...cities, ...citiesForColor], [])
