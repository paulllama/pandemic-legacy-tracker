import React from 'react'
import styled from 'styled-components'

import City from './City'

const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: ${({ isVisible }) => isVisible ? '5vh' : '0'};
	transition: opacity 0.5s, z-index 0.5s, padding-top 0.4s;
	opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
	z-index: ${({ isVisible }) => isVisible ? '100' : '-1'};
`

const ModalMask = styled.div`
	background: #000000AA;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
`

const ModalBody = styled.div`
	max-width: 30em;
	max-height: 90vh;
	width: 100%;
	background: white;
	border-radius: 0.2em;
	padding: 1em;
`

const EpidemicModal = ({ isVisible, close, deck, triggerEpidemic }) => {
	const [search, setSearch] = React.useState('')
	const bottomDeckSection = deck[deck.length - 1]
	const filteredCities = search
		? bottomDeckSection.filter(city => city.name.indexOf(search) >= 0)
		: []

	const searchChange = event => {
		setSearch(event.target.value)
	}

	return (
		<Container isVisible={isVisible}>
			<ModalMask onClick={close}/>
			<ModalBody>
				<input value={search} onChange={searchChange} />
				{filteredCities.map(city => (
					<City city={city} onClick={triggerEpidemic} />
				))}
			</ModalBody>
		</Container>
	)
}

export default EpidemicModal