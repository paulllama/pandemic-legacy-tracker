import React from 'react'
import { INFECTION_AMOUNTS } from '../config'

const InfectionLevel = ({ level }) => (
	<div>
		<div>Infection Level:</div>
		{
			INFECTION_AMOUNTS.map((infectionAmount, index) => (
				<div key={index}>{infectionAmount}</div>
			))
		}
	</div>
)

export default InfectionLevel