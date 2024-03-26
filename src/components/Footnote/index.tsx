import React, {PropsWithChildren, ReactNode} from 'react';
import './index.scss';


interface Props {
}

const Footnote: React.FC<PropsWithChildren<Props>> = ({children}) => {
	return (
		<p className={'footnote'}>
			{children}
		</p>
	)
}

export default Footnote
