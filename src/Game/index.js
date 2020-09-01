import React from 'react'

import View from './View'
import {
	INFECTION_AMOUNTS,
	NUM_PREDICTIONS,
	MAX_DECIMAL_PLACES,
	SEASON_1_CITIES,
} from './config'

const Game = () => {
	const [probabilityCache, setProbabilityCache] = React.useState({})
	const [deck, setDeck] = React.useState([SEASON_1_CITIES])
	const [discardPile, setDiscardPile] = React.useState({})
	const [infectionLevel, setInfectionLevel] = React.useState(0)

	const infectionAmount = INFECTION_AMOUNTS[infectionLevel]

	const moveCityToDiscardFromDeckSection = (sectionIndex, city) => {
		const cardIndex = deck[sectionIndex].indexOf(city)

		// We only want to allow pulling off of specified section
		if (cardIndex === -1) {
			console.warn(`${city.name} not found in deck section ${sectionIndex}`)
			return;
		}

		// Lower the amount of this card
		deck[sectionIndex][cardIndex].frequency--

		// If it was the last one remove it
		if (deck[sectionIndex][cardIndex].frequency === 0) {
				deck[sectionIndex].splice(cardIndex, 1);
		}

		// If the section is empty, delete it
		if (deck[sectionIndex].length === 0) {
				deck.splice(0, 1);
		}

		// If this city is not in the discard already, add it
		if (!discardPile[city.name]) {
				discardPile[city.name] = {
					...city,
					frequency: 0,
				}
		}

		discardPile[city.name].frequency++

		setDiscardPile(discardPile)
		setDeck(deck)
	}

	const playCityCard = city => {
		moveCityToDiscardFromDeckSection(0, city);
		setProbabilityCache({})

		// TODO SAVE GAME STATE
	}

	const triggerEpidemic = city => {
		if (!city) {
			console.error('city required to trigger epidemic')
		}

		moveCityToDiscardFromDeckSection(deck.length - 1, city);

		const discardCopy = Object.values(discardPile);
		setDeck([
			discardCopy,
			...deck,
		])

		setInfectionLevel(infectionLevel + 1)
		setDiscardPile({})
		setProbabilityCache({}) // this.generateProbabilitiesForFullDeck()
	}

	const getSizeOfSection = deckSectionIndex => {
		let section = deck[deckSectionIndex];
		let numCards = 0;

		for (let cityIndex = 0; cityIndex < section.length; cityIndex++) {
			let city = section[cityIndex]
			numCards += city.frequency
		}

		return numCards
	}

	const generateProbabilities = (deckSection, frequency) => {
		let cardsBeforeSection = 0
		let probabilities = []
		let cardsPicked = 0
		let cardsInSection = getSizeOfSection(deckSection)

		for (let section = 0; section < deckSection; section++) {
				cardsBeforeSection += getSizeOfSection(section)
		}

		while (probabilities.length < NUM_PREDICTIONS && cardsInSection > 0) {
			// If the next set is not even in this section, add 0
			if (cardsPicked + infectionAmount <= cardsBeforeSection) {
				probabilities.push(0);
				cardsPicked += infectionAmount;
			}
			// Else we have the chance to pull this card
			else {
				// The city has to get picked
				if (cardsInSection < infectionAmount) {
						probabilities.push(100);
				}
				else {
					let probabilityToNotChoose = 1;
					/*
					  n - f       n - 1 - f       n - 2 - f
					 -------  *  -----------  *  ----------- * ...
					    n           n - 1           n - 2
					*/
					for (let chosenInSet = 0; chosenInSet < infectionAmount; chosenInSet++) {
							probabilityToNotChoose *= (cardsInSection - chosenInSet - frequency) / (cardsInSection - chosenInSet)
					}

					let probability = Math.min(1.0 - probabilityToNotChoose, 1.0)
					let decimalPlaceAdjust = Math.pow(10, MAX_DECIMAL_PLACES)
					probabilities.push(Math.round(probability * 100 * decimalPlaceAdjust) / decimalPlaceAdjust)
				}

				if (probabilities[probabilities.length - 1] === 100) {
					break
				}

				cardsInSection -= infectionAmount
			}
		}

		return probabilities
	}

	const getProbabilitiesForDeckSectionAndFrequency = (deckSection, frequency) => {
		const probabilityCacheHash = `${deckSection}-${frequency}`

		if (!probabilityCache[probabilityCacheHash]) {
			let probabilities = generateProbabilities(deckSection, frequency)
			const hasAtLeastOnePrediction = probabilities.reduce(
				(accumulator, probability) => accumulator || probability !== 0,
				false
			)

			// If all the predictions are 0, just return an empty array
			probabilities = hasAtLeastOnePrediction ? probabilities : []

			setProbabilityCache({
				...probabilityCache,
				[probabilityCacheHash]: probabilities,
			})

			return probabilities
		}

		return probabilityCache[probabilityCacheHash];
	}

	const resetGame = () => {
		setDeck([SEASON_1_CITIES])
		setDiscardPile([])
		setInfectionLevel(0)
		setProbabilityCache({})
	}

	return (
		<View
			infectionLevel={infectionLevel}
			resetGame={resetGame}
			deck={deck}
			discardPile={discardPile}
			getProbabilitiesForDeckSectionAndFrequency={getProbabilitiesForDeckSectionAndFrequency}
			playCityCard={playCityCard}
			triggerEpidemic={triggerEpidemic}
		/>
	)
}

export default Game