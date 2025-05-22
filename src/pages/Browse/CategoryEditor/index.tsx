import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Page from '../../../components/Template/Page';
import Category from '../../../models/category';
import { generateEmptyCategory } from '../../../util/category-utils';
import CategoryRequests from '../../../services/requests/CategoryRequests';
import {
    CategoriesContext,
    CategoriesContextProvider,
    CategoriesContextState
} from '../../../contexts/CategoriesContext';
import CategoryForm from '../../../components/Forms/CategoryForm';
import './index.scss';

const CategoryEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadCategory();
        } else {
            setCategory(generateEmptyCategory());
        }
    }, [id]);

    const loadCategory = async () => {
        try {
            setLoading(true);
            const loadedCategory = await CategoryRequests.getCategory(parseInt(id));
            setCategory(loadedCategory);
        } catch (err) {
            setError('Failed to load category');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any, categoriesContext: CategoriesContextState) => {
        if (!category) return;

        try {
            setLoading(true);
            setError(null);

            const updatedCategory: Category = {
                ...category,
                name: values.name,
                description: values.description,
                can_be_primary: values.can_be_primary
            };

            let savedCategory: Category;
            if (id) {
                savedCategory = await CategoryRequests.updateCategory(parseInt(id), updatedCategory);
            } else {
                savedCategory = await CategoryRequests.createCategory(values.name);
            }
            categoriesContext.addModel(savedCategory);

            history.push('/browse/categories');

        } catch (err) {
            setError('Failed to save category');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <CategoriesContextProvider>
                <CategoriesContext.Consumer>
                    {categoriesContext =>
                        <div className="category-editor">
                            <h1>{id ? 'Edit Category' : 'Create Category'}</h1>
                            
                            <CategoryForm
                                category={category || undefined}
                                onSubmit={(values) => handleSubmit(values, categoriesContext)}
                                isSubmitting={loading}
                                submitError={error}
                                onCancel={() => history.push('/browse/categories')}
                                mode={id ? 'edit' : 'create'}
                            />
                        </div>
                    }
                </CategoriesContext.Consumer>
            </CategoriesContextProvider>
        </Page>
    );
};

export default CategoryEditor;
 