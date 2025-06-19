import User from '../../models/user/user';
import Follower, { FollowerType } from '../../models/user/follower';
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
     * @param addFollower
     */
    static follow(user: User, follows: User|Category, id: number, type: FollowerType, addFollower: (follower: Follower) => void) {
        FollowerRequests.follow(user, follows, id, type).then(addFollower);
    }
}
