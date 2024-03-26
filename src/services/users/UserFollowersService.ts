import User from '../../models/user/user';
import Location from '../../models/location/location';
import Follower from '../../models/user/follower';
import Business from '../../models/organization/business';
import FollowerRequests from '../requests/FollowerRequests';
import Category from "../../models/category";

export default class UserFollowersService {

    /**
     * Use this to follow any entity. This will manage the following of related data if needed
     * @param user
     * @param follows
     * @param id
     * @param type
     * @param existingFollowers
     * @param addFollower
     * @param business
     */
    static follow(user: User, follows: User|Location|Category, id: number, type: string, existingFollowers: Follower[], addFollower: (follower: Follower) => void, business: Business|undefined = undefined) {
        FollowerRequests.follow(user, follows, id, type).then(addFollower);

        if (business && business.locations) {
            business.locations.forEach(location => {
                if (location.id != id && !existingFollowers.find(i => i.follows_type == 'location' && i.follows_id == location.id)) {
                    FollowerRequests.follow(user, location, location.id!, 'location').then(addFollower);
                }
            })
        }
    }
}
