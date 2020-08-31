import styled from 'styled-components'

const ACTIVE_COLOR = '#FACD01'

export const PrimaryButton = styled.button`
	&:before {
		content: '';
		display: block;
		width: calc(100% + 0.5em);
		height: 0;
		border-top: 0.35em dashed black;
		position: absolute;
		transform: skew(45deg);
		left: -0.25em;
		top: 0;
	}

	display: block;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	border-radius: 0.25em;
	background: ${ACTIVE_COLOR};
	border: none;
	padding: 0.75em 0.5em 0.45em;
	font-weight: bold;
	text-transform: uppercase;
`

export const TextButton = styled.button`
	display: block;
	background: transparent;
	padding: 0.5em;
	font-weight: bold;
	text-transform: uppercase;
	border: none;
	color: white;
	text-decoration: underline;
	cursor: pointer;
	transition: color 0.2s;

	&:hover {
		color: ${ACTIVE_COLOR};
	}
`
