import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import {storeReceivedToken, tokenNeedsRefresh} from './AuthManager';
import {appState} from '../data/AppContext';
import {TokenState} from '../data/persistent/persistent.state';
import {decrementLoadingCount, incrementLoadingCount} from '../data/session/session.actions';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	}
});
const refreshApi = axios.create({ baseURL });
let refreshPromise: Promise<TokenState>|null = null;

export const requestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
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

				config.headers = config.headers || {};
				config.headers['Authorization'] = `Bearer ${tokenData.token}`
			}
		}
		return config
	} catch (error) {
		console.log('this is the error', error)
		throw error
	}
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
	if (appState) {
		appState.dispatch(decrementLoadingCount());
	}
	return response;
};

export const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
	if (error.name === 'CanceledError') {
		throw error
	}
	if (appState) {
		appState.dispatch(decrementLoadingCount());
	}
	return Promise.reject(error.response);
};

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default api;
