import React from 'react'
import styled from 'styled-components'

import Nav from './Nav'
import DeckAndDiscard from './DeckAndDiscard'
import EpidemicModal from './EpidemicModal'
import {
	INFECTION_AMOUNTS,
	NUM_PREDICTIONS,
	MAX_DECIMAL_PLACES,
	SEASON_1_CITIES,
} from './config'

const Container = styled.div`
	background: #394756;
	padding: 1em 1em 4em;
`

const Game = () => {
	const [probabilityCache, setProbabilityCache] = React.useState({})
	const [deck, setDeck] = React.useState([SEASON_1_CITIES])
	const [discardPile, setDiscardPile] = React.useState({})
	const [infectionLevel, setInfectionLevel] = React.useState(0)
	const [isShowingEpidemicModal, setIsShowingEpidemicModal] = React.useState(false)

	const infectionAmount = INFECTION_AMOUNTS[infectionLevel]

	const moveCityToDiscardFromDeckSection = (sectionIndex, city) => {
		const cardIndex = deck[sectionIndex].indexOf(city)

		// We only want to allow pulling off of specified section
		if (cardIndex === -1) {
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
				let cityCopy = {
					...city,
					frequency: 0,
				}

				discardPile[city.name] = cityCopy;
		}

		discardPile[city.name].frequency++

		setDiscardPile(discardPile)
		setDeck(deck)
	}

	const openEpidemicModal = () => {
		setIsShowingEpidemicModal(true)
	}

	const closeEpidemicModal = () => {
		setIsShowingEpidemicModal(false)
	}

	const playCityCard = city => {
		moveCityToDiscardFromDeckSection(0, city);
		setProbabilityCache({})

		// TODO SAVE GAME STATE
	}

	const triggerEpidemic = city => {
		moveCityToDiscardFromDeckSection(deck.length - 1, city);

		const discardCopy = Object.values(discardPile);
		setDeck([
			discardCopy,
			...deck,
		])

		setInfectionLevel(infectionLevel + 1)
		setDiscardPile({})
		setProbabilityCache({}) // this.generateProbabilitiesForFullDeck()

		closeEpidemicModal()
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
		<Container>
			<Nav
				infectionLevel={infectionLevel}
				openEpidemicModal={openEpidemicModal}
				resetGame={resetGame}
			/>
			<DeckAndDiscard
				deck={deck}
				discardPile={discardPile}
				openEpidemicModal={openEpidemicModal}
				getProbabilities={getProbabilitiesForDeckSectionAndFrequency}
				playCityCard={playCityCard}
			/>
			<EpidemicModal
				deck={deck}
				isVisible={isShowingEpidemicModal}
				close={closeEpidemicModal}
				triggerEpidemic={triggerEpidemic}
			/>
		</Container>
	)
}

export default Game