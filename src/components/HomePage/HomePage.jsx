import React, { useContext } from 'react'
import { LoggedinContext } from '../../context/loggedinContext'

const HomePage = () => {
	const {loggedIn} = useContext(LoggedinContext)
	console.log(loggedIn)

	return (
		<div>HomePage</div>
	)
}

export default HomePage