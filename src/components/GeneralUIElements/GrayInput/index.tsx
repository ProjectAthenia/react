import React, {PropsWithChildren} from 'react'
import './index.scss';

interface Props extends PropsWithChildren<any> {
}

const GrayInput: React.FC<Props> = ({ children }) => {
	return (
		<div className={'gray-input'}>
			{children}
		</div>
	)
}

export default GrayInput
