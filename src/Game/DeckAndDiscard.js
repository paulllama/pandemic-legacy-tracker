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

const CardGroupTitle = styled.div`
	margin-bottom: 0.55em;
	color: #FFFFFFAA;
	text-transform: uppercase;
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
				<CardGroupTitle>Discard</CardGroupTitle>
				{Object.values(discardPile).map(city => <City city={city} />)}
			</DiscardPile>

			{/* TODO: ADD INPUT SEARCH */}
			{deck.map((deckSection, sectionIndex) => (
				<CardGroup key={sectionIndex}>
					<CardGroupTitle>
						{sectionIndex === 0 ? 'Top deck section' : `Section ${sectionIndex + 1}`}
					</CardGroupTitle>
					{deckSection.map((city, index) => (
						<City
							key={index}
							city={city}
							probabilities={getProbabilities(sectionIndex, city.frequency)}
							onClick={playCityCard}
						/>
					))}
				</CardGroup>
			))}
		</Container>
	)
}

export default CityCards
