import axios from 'axios'
import {storeReceivedToken, tokenNeedsRefresh} from './AuthManager';
import {appState} from '../data/AppContext';
import {TokenState} from '../data/persistent/persistent.state';
import {decrementLoadingCount, incrementLoadingCount} from '../data/session/session.actions';

const baseURL = process.env.REACT_APP_API_URL + 'v1';

const api = axios.create({ baseURL });
const refreshApi = axios.create({ baseURL });
let refreshPromise: Promise<TokenState>|null = null;

api.interceptors.request.use(async (config) => {
	try {

		// this will not be defined during tests
		if (appState) {
			appState.dispatch(incrementLoadingCount());

			let tokenData = appState.state.persistent.tokenData;

			if (tokenData) {

				if (tokenNeedsRefresh(tokenData)) {
					if (!refreshPromise) {
						refreshPromise = refreshApi.post('/auth/refresh', null, {
							headers: {Authorization: `Bearer ${tokenData.token}`}
						}).then(({data}) => {
							setTimeout(() => {
								refreshPromise = null;
							}, 50)
							return Promise.resolve(storeReceivedToken(data.token));
						});
					}
					tokenData = await refreshPromise
				}

				config.headers['Authorization'] = `Bearer ${tokenData.token}`

			}
		}
		return config
	} catch (error) {
		console.log('this is the error', error)
		throw error
	}
});

api.interceptors.response.use((response) => {

	appState.dispatch(decrementLoadingCount());

	return response;
}, (error => {

	appState.dispatch(decrementLoadingCount());

	return Promise.reject(error.response);
}))

export {api}
