import Category, {isCategoryEligibleForProPlan} from "./category";

test('isCategoryEligibleForProPlan returns true if category is eligble', () => {
    const category = {
        name: 'art',
        can_be_primary: true
    } as Category;
    const result = isCategoryEligibleForProPlan(category);
    expect(result).toBeTruthy();
})

test('isCategoryEligibleForProPlan returns false if the can_be_primary is false', () => {
    const category = {
        name: 'art',
        can_be_primary: false
    } as Category;
    const result = isCategoryEligibleForProPlan(category);
    expect(result).toBeFalsy();
})
