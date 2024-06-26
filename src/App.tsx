import React from 'react'
import {Route} from 'react-router'
import Home from './pages/Home';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import {connect} from './data/connect';
import {AppContextProvider} from './data/AppContext';
import {TokenState} from './data/persistent/persistent.state';
import {BrowserRouter, Redirect, useHistory} from "react-router-dom";


/* Theme variables */
import './theme/main.scss'
import Splash from "./pages/Splash";
import SignInEmail from "./pages/SignIn";
import SignUp from "./pages/SignUp";


interface StateProps {
	tokenData?: TokenState
}

interface DispatchProps {
}

interface AppProps extends StateProps, DispatchProps {
}

const ReactApp: React.FC<AppProps> = ({tokenData}) => {

	const history = useHistory();
	return (
		<BrowserRouter>
			<main id={"main"}>
				<AuthenticatedRoute path="/home*" render={() => <Home/>}/>
				<Route path="/splash" render={() => <Splash/>}/>
				<Route exact path='/login'><SignInEmail/></Route>
				<Route exact path='/sign-up'><SignUp/></Route>
				<Route exact path='/'><Redirect to={'/splash'}/></Route>
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
		<AppContextProvider>
			<ReactAppConnected />
		</AppContextProvider>
	);
};

export default App;

