import React, { ReactNode } from 'react'
import './index.scss';

interface Props {
	label: string
	subtext?: string
	error?: string
	color?: string
	rounded?: boolean
	children?: ReactNode
}

const InputWrapper: React.FC<Props> = ({  label, error, color, rounded, subtext, children }) => {
	const wrapperClasses =  (color ? ' ' + color : '') + (rounded ? ' rounded' : '')
	return (
		<div className={'input-wrapper' + wrapperClasses}>
			<label color={error ? 'danger' : 'dark'}>{error ? error : label}</label>
			{children}
			{subtext && <p className={'subtext'}>{subtext}</p>}
		</div>
	)
}

export default InputWrapper
