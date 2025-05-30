import BaseModel from './base-model';

export default interface Page<T> extends BaseModel {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const placeholderPage = <T>(): Page<T> => ({
    id: 0,
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    created_at: '',
    updated_at: ''
});

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
