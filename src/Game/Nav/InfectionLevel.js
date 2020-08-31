import React from 'react'
import { INFECTION_AMOUNTS } from '../config'
import styled from 'styled-components'
import { PrimaryButton } from '../Buttons'

export const COLOR_INFECTION = '#39AC6C'

const InfectionStage = styled.div`
	width: 2em;
	height: 2em;
	border-radius: 50%;
	background: ${COLOR_INFECTION}55;
	border: 0.2em solid ${COLOR_INFECTION}AA;
	text-align: center;
	line-height: 2em;
	font-weight: bold;
	color: ${COLOR_INFECTION}AA;
	margin-right: 0.35em;
`

const ActiveInfectionStage = styled(InfectionStage)`
	background: ${COLOR_INFECTION};
	color: white;
`

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

const Title = styled.div`
	color: white;
	font-weight: bold;
	font-size: 1.25rem;
	text-transform: uppercase;
	line-height: 1;
	margin-right: 0.35em;
`

const InfectionLevel = ({ level, openEpidemicModal }) => (
	<Container>
		<Title>Infection Level</Title>
		{
			INFECTION_AMOUNTS.map((infectionAmount, index) => level === index
				? <ActiveInfectionStage key={index}>{infectionAmount}</ActiveInfectionStage>
				: <InfectionStage key={index}>{infectionAmount}</InfectionStage>
			)
		}
		<PrimaryButton onClick={openEpidemicModal}>Trigger Epidemic</PrimaryButton>
	</Container>
)

export default InfectionLevel