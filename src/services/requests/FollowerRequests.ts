import {api} from '../api';
import Follower from '../../models/user/follower';
import Location from '../../models/location/location';
import User from '../../models/user/user';
import Category from "../../models/category";

export default class FollowerRequests {

    /**
     * Lets our logged in user to start following the business
     * @param user
     * @param follows
     * @param id
     * @param type
     */
    static async follow(user: User, follows: User|Location|Category, id: number, type: string): Promise<Follower> {
        const {data} = await api.post('/users/' + user.id + '/follows', {
            follows_id: id,
            follows_type: type,
            notify: true,
        });

        return {
            ...data,
            follows: follows,
        } as Follower;
    }

    /**
     * Allows a user to stop following a business
     * @param follower
     */
    static unFollow(follower: Follower): Promise<any> {
        return api.delete('/users/' + follower.user_id + '/follows/' + follower.id);
    }

    /**
     * Runs the update for us
     * @param follower
     * @param updateData
     */
    static update(follower: Follower, updateData: any): Promise<Follower> {
        return api.put('/users/' + follower.user_id + '/follows/' + follower.id, updateData)
    }
}
