import React from 'react'
import styled from 'styled-components'

import { CITY_COLOR } from './config'

const CSS_COLOR = {
	[CITY_COLOR.RED]: '#d20404',
	[CITY_COLOR.BLUE]: '#38359a',
	[CITY_COLOR.BLACK]: '#000000',
	[CITY_COLOR.YELLOW]: '#d2ba00',
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: ${({ color }) => CSS_COLOR[color]}55;
	padding: 0.75em 1em;
	cursor: pointer;
	color: white;
	transition: background 0.2s;

	&:first-of-type {
		border-top-left-radius: 0.25em;
		border-top-right-radius: 0.25em;
	}

	&:last-of-type {
		border-bottom-left-radius: 0.25em;
		border-bottom-right-radius: 0.25em;
	}

	&:hover {
		background: ${({ color }) => CSS_COLOR[color]}99;
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

	&:nth-of-type(2) {
		opacity: 0.7;
	}

	&:nth-of-type(3) {
		opacity: 0.4;
	}
`

const City = ({
	city,
	probabilities,
	onClick,
}) => {
	const onCityClick = onClick
		? onClick.bind(null, city)
		: null

	return (
		<Container onClick={onCityClick} color={city.color}>
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