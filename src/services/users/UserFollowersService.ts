import User from '../../models/user/user';
import Follower from '../../models/user/follower';
import FollowerRequests from '../requests/FollowerRequests';
import Category from "../../models/category";
import api from '../api';

export default class UserFollowersService {

    /**
     * Use this to follow any entity. This will manage the following of related data if needed
     * @param user
     * @param follows
     * @param id
     * @param type
     * @param existingFollowers
     * @param addFollower
     */
    static follow(user: User, follows: User|Category, id: number, type: string, existingFollowers: Follower[], addFollower: (follower: Follower) => void) {
        FollowerRequests.follow(user, follows, id, type).then(addFollower);
    }

    static async getBusinesses(user: User): Promise<any[]> {
        const {data} = await api.get('/users/' + user.id + '/businesses');
        return data;
    }
}
