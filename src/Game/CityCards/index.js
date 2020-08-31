import React from 'react'
import styled from 'styled-components'

import City from './City'

const Container = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 1.5em;
`

const CardGroup = styled.div`
	width: 20em;
	padding: 0 1em;
	display: flex;
	flex-direction: column;
`

const DiscardPile = styled(CardGroup)`
	&:before {
		content: '';
		display: block;
		height: calc(100% + 0.5em);
		width: 0;
		border-right: 0.35em dashed #FFFFFF22;
		position: absolute;
		transform: skew(0, 45deg);
		right: -1.1em;
		top: 0;
	}

	position: relative;
	margin-right: 2em;
`

const CityCards = ({
	deck,
	discardPile,
	getProbabilities,
	playCityCard,
}) => {
	return (
		<Container>
			<DiscardPile key="Discard Pile">
				{Object.values(discardPile).map(city => <City city={city} />)}
			</DiscardPile>

			{/* Deck Sections */}
			<div key="Deck Sections">
				{/* TODO: ADD INPUT SEARCH */}
				{deck.map((deckSection, sectionIndex) => (
					<CardGroup key={sectionIndex}>
						{deckSection.map((city, index) => (
							<City
								key={index}
								city={city}
								probabilities={getProbabilities(sectionIndex, city.frequency)}
								playCityCard={playCityCard.bind(null, city)}
							/>
						))}
					</CardGroup>
				))}
			</div>
		</Container>
	)
}

export default CityCards
