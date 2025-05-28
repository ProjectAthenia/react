import React, { PropsWithChildren } from 'react'
import './index.scss';

interface Props extends PropsWithChildren<any> {
	value?: string;
	onChange?: (value: string) => void;
}

const BorderedInput: React.FC<Props> = ({ children, value, onChange }) => {
	return (
		<div className={'bordered-input'}>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				aria-label="bordered input"
			/>
			{children}
		</div>
	)
}

export default BorderedInput
