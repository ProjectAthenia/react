export default interface BaseModel {

    /**
     * auto incrementing id
     */
    id?: number;

    /**
     * Every model has a created at timestamp
     */
    created_at?: string;

    /**
     * Every model has an updated at timestamp
     */
    updated_at?: string;
}

/**
 * Filters out all non-unique models based on id
 * @param models
 */
export function filterUnique<Type extends BaseModel>(models: Type[]) : Type[] {
    return models
        .filter((value, index, self) => self.findIndex(v => v.id === value.id) === index)
}
