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

const Nav = ({
	resetGame,
	infectionLevel,
	openEpidemicModal,
}) => {
	return (
		<Container>
			<InfectionLevel level={infectionLevel} openEpidemicModal={openEpidemicModal} />
			<TextButton onClick={resetGame}>Reset Game</TextButton>
		</Container>
	)
}

export default Nav