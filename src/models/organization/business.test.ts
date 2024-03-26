import Business, {isBusinessEligibleForProPlan} from './business'
import Category from "../category";

test('isBusinessEligibleForProPlan returns true if the business category is eligible', () => {
    const business = {
        main_category: {
            name: 'art',
            can_be_primary: true
        } as Category
    } as Business;
    const result = isBusinessEligibleForProPlan(business);
    expect(result).toBeTruthy();
})
