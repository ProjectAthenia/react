import BaseModel from './base-model';

export default interface Page<Model> {

    /**
     * The total amount of data
     */
    total: number;

    /**
     * What page we are currently on
     */
    current_page: number;

    /**
     * The last page of all results
     */
    last_page: number;

    /**
     * All entries within this page
     */
    data: Model[];
}

export function createDummyPage<Model>() : Page<Model>{
    return {
        current_page: 0,
        last_page: 0,
        total: 0,
        data: [],
    }
}

/**
 * Merges all of the data together
 * @param page
 * @param existingEntries
 */
export function mergePageData(page: Page<BaseModel>, existingEntries: BaseModel[]): BaseModel[]
{
    const data = (page.data as any[]) as BaseModel[];
    data.forEach(entry => {
        const index = existingEntries.findIndex(i => i.id === entry.id);
        if (index !== -1) {
            existingEntries[index] = entry;
        } else {
            existingEntries.push(entry);
        }
    });
    return (existingEntries as any[]) as BaseModel[];
}
