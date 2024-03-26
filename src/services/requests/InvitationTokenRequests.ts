import {api} from '../api';

export default class InvitationTokenRequests {

    /**
     * This will validate that an invite will
     * @param token
     */
    static validateInvite(token: string): Promise<any> {
        return api.post('/validate-invitation', {token});
    }
}
