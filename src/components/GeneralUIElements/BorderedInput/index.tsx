import React, {PropsWithChildren} from 'react'
import './index.scss';

interface Props extends PropsWithChildren<any> {
}

const BorderedInput: React.FC<Props> = ({ children }) => {
	return (
		<div className={'bordered-input'}>
			{children}
		</div>
	)
}

export default BorderedInput
