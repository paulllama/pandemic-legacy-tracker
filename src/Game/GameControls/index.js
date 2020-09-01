import React from 'react'
import styled from 'styled-components'

import InfectionLevel from './InfectionLevel'
import { TextButton } from '../Buttons'

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0.5em;
`

const RightText = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	font-size: .8em;
`

const LastSaveDate = styled.div`
	margin-top: 0.75em;
	font-size: 0.9em;
	color: #FFFFFF77;
`

const GameControls = ({
	resetGame,
	infectionLevel,
	openEpidemicModal,
	lastSaveDate,
}) => {
	const [dateFormat, setDateFormat] = React.useState()

	React.useEffect(() => {
		setDateFormat(new Intl.DateTimeFormat('en', { timeStyle: 'medium', dateStyle: 'short' }))
	}, [])

	const isSaved = dateFormat && lastSaveDate

	return (
		<Container>
			<InfectionLevel level={infectionLevel} openEpidemicModal={openEpidemicModal} />
			<RightText>
				<TextButton onClick={resetGame}>Reset Game</TextButton>
				<LastSaveDate>
					{isSaved ? `Last saved: ${dateFormat.format(lastSaveDate)}` : 'Not saved yet'}
				</LastSaveDate>
			</RightText>
		</Container>
	)
}

export default GameControls