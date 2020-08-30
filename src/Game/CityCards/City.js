import React from 'react'

const City = ({
	city,
	probabilities,
	playCityCard,
}) => {
	return (
		<div onClick={playCityCard}>
			<div>{city.frequency}</div>
			<div>{city.name}</div>
			<div>
				{probabilities && probabilities.map((probability, index) => (
					<span key={index}>{probability}%</span>
				))}
			</div>
	</div>
	)
}

export default City