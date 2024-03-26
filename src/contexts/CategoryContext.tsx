import React, {PropsWithChildren, useEffect, useState} from 'react';
import Category, {generateEmptyCategory} from '../models/category';
import CategoryRequests from '../services/requests/CategoryRequests';
import LoadingScreen from '../components/LoadingScreen';

let cachedCategories = [] as Category[];

/**
 * The structure of the consumer
 */
export interface CategoryContextConsumerState {
    hasLoaded: boolean,
    notFound: boolean,
    category: Category,
    setCategory: (category: Category) => void,
}

let defaultContext: CategoryContextConsumerState = {
    hasLoaded: false,
    notFound: false,
    category: generateEmptyCategory(),
    setCategory: (category: Category) => {}
};

export const CategoryContext = React.createContext<CategoryContextConsumerState>(defaultContext);

export interface CategoryContextProviderProps {
    categoryId: number,
    skipCache?: boolean,
}

export const CategoryContextProvider: React.FC<PropsWithChildren<CategoryContextProviderProps>> = ({categoryId, skipCache, children}) => {
    const [categoryState, setCategoryState] = useState(defaultContext);

    const setCategory = (category: Category): void => {
        cachedCategories[category.id!] = {...category};
        setCategoryState({
            ...categoryState,
            category: category,
        })
    }

    useEffect(() => {
        if (!skipCache && cachedCategories[categoryId]) {
            setCategoryState({
                hasLoaded: true,
                notFound: false,
                category: cachedCategories[categoryId],
                setCategory: setCategory,
            });
        } else {
            setCategoryState({
                ...categoryState,
                hasLoaded: false,
            });
            CategoryRequests.getCategory(categoryId).then(category => {
                cachedCategories[categoryId] = category;
                setCategoryState({
                    hasLoaded: true,
                    notFound: false,
                    category: category,
                    setCategory,
                });
            }).catch(() => {
                setCategoryState({
                    ...categoryState,
                    hasLoaded: true,
                    notFound: true,
                });
            })
        }
    }, [categoryId]);

    return (
        <CategoryContext.Provider value={{...categoryState, setCategory}}>
            <CategoryContext.Consumer>
                {context => (context.hasLoaded ?
                    (!context.notFound ? children :
                        <div className={'category-not-found'}>
                            Not Found
                        </div>
                    ) : <LoadingScreen/>
                )}
            </CategoryContext.Consumer>
        </CategoryContext.Provider>
    )
}
