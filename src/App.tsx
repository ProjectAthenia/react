import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import {connect} from './data/connect';
import {AppContextProvider} from './data/AppContext';
import {TokenState} from './data/persistent/persistent.state';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import Browse from './pages/Browse';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export const mantimeTheme = createTheme({
	primaryColor: 'blue',
	fontFamily: 'Inter, sans-serif',
	other: {
		primaryShade: { light: 6, dark: 8 }
	},
	components: {
		Table: {
			styles: {
				th: {
					backgroundColor: '#f8f9fa',
					borderBottom: '2px solid #dee2e6',
					padding: '1rem',
				},
				td: {
					padding: '1rem',
				},
				tr: {
					'&:hover': {
						backgroundColor: '#f8f9fa',
					},
				},
			},
		},
	},
});

interface StateProps {
	tokenData?: TokenState
}

interface DispatchProps {
}

interface AppProps extends StateProps, DispatchProps {
}

const ReactApp: React.FC<AppProps> = () => {
	return (
		<BrowserRouter>
			<main id={"main"}>
				<Switch>
					<Route path="/browse" component={Browse} />
					<Route path="/sign-in" component={SignIn} />
					<Route path="/sign-up" component={SignUp} />
					<Route path="/" component={Home} />
				</Switch>
			</main>
		</BrowserRouter>
	)
}

const ReactAppConnected = connect<{}, StateProps, DispatchProps>({
	mapStateToProps: (state) => ({
		tokenData: state.persistent.tokenData
	}),
	mapDispatchToProps: { },
	component: ReactApp
});

const App: React.FC = () => {
	return (
		<MantineProvider theme={mantimeTheme}>
			<AppContextProvider>
				<ReactAppConnected />
			</AppContextProvider>
		</MantineProvider>
	);
}

export default App;

