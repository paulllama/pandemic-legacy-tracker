import React from 'react'
import InfectionLevel from './InfectionLevel'

const Nav = ({
	resetGame,
}) => {
	return (
		<div>
			<InfectionLevel level={1} />
			<div>
					<div>Season 1</div>
					<button onClick={resetGame}>Reset Game</button>
			</div>
		</div>
	)
}

export default Nav