import React from 'react'

import './index.scss';
import {Link} from "react-router-dom";

const Splash: React.FC = () => {

	return (
		<section id={'splash-page'}>
			<div>
				<h2>Hello World!</h2>
			</div>
			<Link to={'/sign-in'}>
				Sign In
			</Link>
		</section>
	);
}

export default Splash;
