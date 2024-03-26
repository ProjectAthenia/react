import React, {PropsWithChildren} from 'react'
import './index.scss';

interface Props extends PropsWithChildren<any> {
}

const UnderlinedInput: React.FC<Props> = ({ children }) => {
	return (
		<div className={'underlined-input'}>
			{children}
		</div>
	)
}

export default UnderlinedInput
