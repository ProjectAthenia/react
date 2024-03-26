import {api} from '../api';
import Page from '../../models/page';
import Category from '../../models/category';

export default class CategoryRequests {

    /**
     * All cached results from any category requests
     */
    private static cachedResults: {[key: string]: Category[]} = {};
    private static cachedIds: {[key: number]: Category} = {};

    /**
     * Searches for a category based on the passed in name
     * @param name
     * @return Category[]
     */
    static async searchCategories(name: string): Promise<Category[]> {

        if (CategoryRequests.cachedResults[name] !== undefined)  {
            return CategoryRequests.cachedResults[name];
        }

        const { data } = await api.get('/categories', {
            params: {
                'search[name]': 'like,*' + name + '*',
            }
        });
        const result = (data as Page<Category>).data;

        CategoryRequests.cachedResults[name] = result;

        return result;
    }

    /**
     * Gets a category based on the passed in ID
     * @param id
     * @return Category
     */
    static async getCategory(id: number): Promise<Category> {

        if (CategoryRequests.cachedIds.hasOwnProperty(id))  {
            return CategoryRequests.cachedIds[id];
        }

        const { data } = await api.get('/categories/' + id, );
        const result = (data as Category);

        CategoryRequests.cachedIds[id] = result;

        return result;
    }


    /**
     * Creates a category for us properly
     * @param name
     */
    static async createCategory(name: string): Promise<Category> {
        const { data } = await api.post('/categories ', {
            name: name,
        });
        return data as Category;
    }
}
