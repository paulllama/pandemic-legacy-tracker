import React from 'react'
import InfectionLevel from './InfectionLevel'

const Nav = ({
	resetGame,
	infectionLevel,
}) => {
	return (
		<div>
			<InfectionLevel level={infectionLevel} />
			<div>
					<div>Season 1</div>
					<button onClick={resetGame}>Reset Game</button>
			</div>
		</div>
	)
}

export default Nav