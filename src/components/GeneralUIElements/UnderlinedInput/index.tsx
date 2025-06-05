import React, { ReactNode } from 'react'
import './index.scss';

interface Props {
	children?: ReactNode;
}

const UnderlinedInput: React.FC<Props> = ({ children }) => {
	return (
		<div className={'underlined-input'}>
			{children}
		</div>
	)
}

export default UnderlinedInput
