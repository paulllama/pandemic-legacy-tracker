import React from 'react'
import styled from 'styled-components'

import { CITY_COLOR } from '../config'

const CSS_COLOR = {
	[CITY_COLOR.RED]: '#d2040455',
	[CITY_COLOR.BLUE]: '#38359a55',
	[CITY_COLOR.BLACK]: '#00000055',
	[CITY_COLOR.YELLOW]: '#d2ba0055',
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: ${({ color }) => CSS_COLOR[color]};
	padding: 0.75em 1em;
	cursor: pointer;
	color: white;

	&:first-of-type {
		border-top-left-radius: 0.25em;
		border-top-right-radius: 0.25em;
	}

	&:last-of-type {
		border-bottom-left-radius: 0.25em;
		border-bottom-right-radius: 0.25em;
	}
`

const CityInfo = styled.div`
	text-transform: uppercase;
`

const CityStats = styled.div`

`

const Probability = styled.span`
	margin-left: 1em;
	font-size: 0.75em;
`

const City = ({
	city,
	probabilities,
	playCityCard,
}) => {
	return (
		<Container onClick={playCityCard} color={city.color}>
			<CityInfo>
				{city.name}
				<span>{city.frequency > 1 ? `(${city.frequency})` : ''}</span>
			</CityInfo>
			<CityStats>
				{probabilities && probabilities.map((probability, index) => (
					<Probability key={index}>{probability}%</Probability>
				))}
			</CityStats>
		</Container>
	)
}

export default City