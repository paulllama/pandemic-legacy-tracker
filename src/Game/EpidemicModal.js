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
	background: #000000BB;
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
	background: #394756;
	border-radius: 0.2em;
	padding: 1em;
	display: flex;
	flex-direction: column;
`

const ModalTitle = styled.div`
	font-size: 1.5em;
	text-transform: uppercase;
	color: white;
	margin-bottom: 0.75em;
`

const SearchInput = styled.input`
	font-size: 1em;
	padding: 0.25em 0.5em;
	background: #FFFFFFCC;
	border: 0;
	border-radius: 0.2em;
	margin-bottom: 1em;

	&:focus {
		outline: none;
	}
`

const EpidemicModal = ({ isVisible, close, deck, triggerEpidemic }) => {
	const [search, setSearch] = React.useState('')
	const bottomDeckSection = deck[deck.length - 1]
	const filteredCities = search
		? bottomDeckSection.filter(city => city.name.indexOf(search) >= 0)
		: []
	const hasNoResults = search && filteredCities.length === 0

	const searchChange = event => {
		setSearch(event.target.value)
	}
	const closeAndReset = () => {
		setSearch('')
		close()
	}

	return (
		<Container isVisible={isVisible}>
			<ModalMask onClick={closeAndReset}/>
			<ModalBody>
				<ModalTitle>Epidemic!</ModalTitle>
				<SearchInput value={search} onChange={searchChange} placeholder="Search for a city" />
				{hasNoResults
					? <span>No cities found</span>
					: filteredCities.map(city => (
						<City key={city.name} city={city} onClick={triggerEpidemic} />
					))
				}
			</ModalBody>
		</Container>
	)
}

export default EpidemicModal