import {api} from '../api'
import User from '../../models/user/user';
import {SignUpData} from '../../contexts/signin/SignUpContext';
import {storeReceivedToken} from '../AuthManager';

export interface LoginReq {
	apple_sign_in_token?: string
	email?: string
	phone?: string
	password?: string
}

export default class AuthRequests {

	/**
	 * Runs the sign in request, and then gets the logged in users information
	 * @param user
	 */
	static async signIn(user: LoginReq): Promise<true>  {
		const {
			data: { token }
		} = await api.post('/auth/login', user);

		storeReceivedToken(token);

		return true;
	}

	/**
	 * Runs the sign up request, and then get the full user information off the server
	 * @param submissionData
	 */
	static async signUp(submissionData: SignUpData): Promise<true> {

		const {invitation_token, age, ...data} = submissionData;

		if (invitation_token) {
			(data as any)['invitation_token'] = invitation_token
		}

		const {
			data: { token }
		} = await api.post('/auth/sign-up', data);

		storeReceivedToken(token);

		return true;
	}

	/**
	 * Gets the users initial information, and returns them to
	 */
	static async getMe() : Promise<User> {
		const { data } = await api.get('/users/me', {
			params: {
				'expand[invitationToken]': '*',
				'expand[organizationManagers]': '*',
				'expand[organizationManagers.organization]': '*',
				'expand[organizationManagers.organization.businesses]': '*',
				'expand[organizationManagers.organization.businesses.mainCategory]': '*',
				'expand[followedCategories]': '*',
				'expand[roles]': '*',
			}
		});
		return data as User;
	}

	/**
	 * Updates the user information properly
	 * @param userId
	 * @param updateData
	 */
	static async updateMe(userId: number, updateData: any): Promise<User> {
		const { data } = await api.put('/users/' + userId, updateData);
		return data as User;
	}

	/**
	 * Erase a user from existence
	 */
	static async eraseMe(): Promise<User> {
		const { data } = await api.delete('/users/erase');
		return data;
	}
}
