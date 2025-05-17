import Category from '../../../models/category';

export const mockCategory = (overrides: Partial<Category> = {}): Category => ({
    id: 1,
    name: 'Test Category',
    description: '',
    can_be_primary: true,
    ...overrides
}); 