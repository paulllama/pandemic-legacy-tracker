import React from 'react'
import styled from 'styled-components'

import Nav from './Nav'
import DeckAndDiscard from './DeckAndDiscard'
import EpidemicModal from './EpidemicModal'

const Container = styled.div`
	background: #394756;
	padding: 1em 1em 4em;
`

const View = ({
	infectionLevel,
	resetGame,
	deck,
	discardPile,
	getProbabilitiesForDeckSectionAndFrequency,
	playCityCard,
	triggerEpidemic,
}) => {
	const [isShowingEpidemicModal, setIsShowingEpidemicModal] = React.useState(false)

	const openEpidemicModal = () => {
		setIsShowingEpidemicModal(true)
	}

	const closeEpidemicModal = () => {
		setIsShowingEpidemicModal(false)
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

export default View