import React, { ReactNode} from 'react'
import './index.scss';

interface Props {
	children?: ReactNode;
}

const GrayInput: React.FC<Props> = ({ children }) => {
	return (
		<div className={'gray-input'}>
			{children}
		</div>
	)
}

export default GrayInput
