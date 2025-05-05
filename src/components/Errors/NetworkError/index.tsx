import React from 'react';
import './index.scss';


const NetworkError: React.FC = () => {
	return (
		<div className={'network-error'}>
			<h2>Unable to Connect</h2>
			<span className={"icon icon-close"} data-testid="close-icon" />
			<p>It looks like there was an issue connecting to the server. Please check your connection and try again.</p>
		</div>
	)
}

export default NetworkError
