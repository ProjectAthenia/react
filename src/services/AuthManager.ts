import {TokenState} from '../data/persistent/persistent.state';
import {appState} from '../data/AppContext';
import {setTokenData} from '../data/persistent/persistent.actions';

const TOKEN_REFRESH_INTERVAL = 10 * 60 * 60 * 1000;

export function tokenNeedsRefresh(tokenData: TokenState): boolean {
    return tokenData.receivedAt + TOKEN_REFRESH_INTERVAL < Date.now();
}

/**
 * Puts our token into our persistent storage properly
 * @param token
 */
export function storeReceivedToken(token: string): TokenState {

    const tokenData = {
        token: token,
        receivedAt: Date.now(),
    }
    appState.dispatch(setTokenData(tokenData));

    return tokenData
}
