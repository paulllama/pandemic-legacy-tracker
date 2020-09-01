import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: row;
	background: #20222f;
	padding: 1em 1em;
	justify-content: space-between;
	align-items: center;
	line-height: 1;
`

const Logo = styled.div`
	color: #FACD01;
	text-transform: uppercase;
	font-style: italic;
	font-weight: bold;
	font-size: 2em;
`

const CreatedBy = styled.span`
	color: #FFFFFF77;
	font-size: 0.85em;

	a {
		color: #FFFFFFBB;
		transition: color 0.2s;

		&:hover {
			color: #FFFFFFFF;
		}
	}
`

const SiteNav = () => (
	<Container>
		<Logo>Pandemic Legacy Tracker</Logo>
		<CreatedBy>
			Created by <a href="//paularmer.me" rel="noopener noreferrer" target="_blank">Paul Armer</a>
		</CreatedBy>
	</Container>
)

export default SiteNav