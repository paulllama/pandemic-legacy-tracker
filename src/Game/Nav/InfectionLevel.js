import React from 'react'
import { INFECTION_AMOUNTS } from '../config'
import styled from 'styled-components'

export const COLOR_INFECTION = '#39AC6C'

const InfectionStage = styled.div`
	width: 2em;
	height: 2em;
	border-radius: 50%;
	background: ${COLOR_INFECTION}55;
	border: 0.25em solid ${COLOR_INFECTION};
	text-align: center;
	line-height: 2em;
	font-weight: bold;
	color: ${COLOR_INFECTION}AA;
	margin-left: 0.35em;
`

const ActiveInfectionStage = styled(InfectionStage)`
	background: ${COLOR_INFECTION};
	color: white;
`

const Container = styled.div`
	display: flex;
	flex-direction: row;
`

const Title = styled.div`
	color: white;
	font-weight: bold;
	font-size: 1.25rem;
`

const InfectionLevel = ({ level }) => (
	<Container>
		<Title>Infection Level:</Title>
		{
			INFECTION_AMOUNTS.map((infectionAmount, index) => level === index
				? <ActiveInfectionStage key={index}>{infectionAmount}</ActiveInfectionStage>
				: <InfectionStage key={index}>{infectionAmount}</InfectionStage>
			)
		}
	</Container>
)

export default InfectionLevel