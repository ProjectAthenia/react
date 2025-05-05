import React, { useState, useRef, useMemo } from 'react';
import { Button, Stack, Text, ActionIcon } from '@mantine/core';
import { IconX, IconPlus, IconTrash } from '@tabler/icons-react';
import Collection from '../../../../models/user/collection';
import CollectionItem from '../../../../models/user/collection-items';
import Release from '../../../../models/game/release';
import CategoryAutocomplete from '../../../GeneralUIElements/CategoryAutocomplete';
import Category from '../../../../models/category';
import { CollectionItemCategory } from '../../../../models/user/collection-item-category';
import { isReleaseInCollection, getCollectionItemForRelease } from '../../../../util/gaming-utils';
import CollectionManagementRequests from '../../../../services/requests/CollectionManagementRequests';
import { CollectionItemsContextState } from '../../../../contexts/CollectionItemsContext';
import './index.scss';

// Function to add a release to a collection
const handleAddToCollection = async (
    release: Release, 
    collection: Collection, 
    collectionItemsContext: CollectionItemsContextState,
    setLoadingCollectionId: (id: number | null) => void
): Promise<void> => {
    if (!release || !collection.id) return;
    
    setLoadingCollectionId(collection.id);
    
    try {
        // Create the collection item
        const collectionItemData = {
            item_id: release.id,
            item_type: 'release',
            order: 0
        };
        
        const newCollectionItem = await CollectionManagementRequests.createCollectionItem(collection, collectionItemData);
        
        // Add the item to the collection items context
        const collectionState = collectionItemsContext[collection.id];
        collectionState.addModel(newCollectionItem);
    } catch (error) {
        console.error('Error adding to collection:', error);
    } finally {
        setLoadingCollectionId(null);
    }
};

// Function to add multiple releases to a collection
const handleBulkAddToCollection = async (
    releases: Release[],
    collection: Collection,
    collectionItemsContext: CollectionItemsContextState,
    setLoadingCollectionId: (id: number | null) => void
): Promise<void> => {
    if (!collection.id) return;
    
    setLoadingCollectionId(collection.id);
    
    try {
        // Create collection items for each release
        const collectionItemPromises = releases.map(release => {
            const collectionItemData = {
                item_id: release.id,
                item_type: 'release' as const,
                order: 0
            };
            return CollectionManagementRequests.createCollectionItem(collection, collectionItemData);
        });

        const newCollectionItems = await Promise.all(collectionItemPromises);
        
        // Add all items to the collection items context
        const collectionState = collectionItemsContext[collection.id];
        newCollectionItems.forEach(item => collectionState.addModel(item));
    } catch (error) {
        console.error('Error bulk adding to collection:', error);
    } finally {
        setLoadingCollectionId(null);
    }
};

// Function to remove a release from a collection
const handleRemoveFromCollection = async (
    release: Release, 
    collection: Collection, 
    collectionItemsContext: any,
    setLoadingCollectionId: (id: number | null) => void
): Promise<void> => {
    if (!release || !collection.id) return;
    
    setLoadingCollectionId(collection.id);
    
    try {
        const collectionItem = getCollectionItemForRelease(release, collection, collectionItemsContext);
        if (!collectionItem) {
            throw new Error('Collection item not found');
        }
        
        // Remove the collection item
        await CollectionManagementRequests.removeCollectionItem(collectionItem);
        
        // Remove the item from the collection items context
        const collectionState = collectionItemsContext[collection.id];
        collectionState.removeModel(collectionItem);
    } catch (error) {
        console.error('Error removing from collection:', error);
    } finally {
        setLoadingCollectionId(null);
    }
};

// Function to add a category to a collection item
const handleAddCategory = async (
    collectionItem: CollectionItem,
    category: Category,
    setLoadingCategoryId: (id: number | null) => void,
    collectionItemsContext: any
): Promise<void> => {
    if (!collectionItem || !category || !collectionItem.id || !category.id) return;
    
    setLoadingCategoryId(category.id);
    
    try {
        // Create the collection item category
        const categoryData = {
            category_id: category.id,
            linked_at: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            linked_at_format: 'Y-m-d' as const
        };
        
        const newCollectionItemCategory = await CollectionManagementRequests.createCollectionItemCategory(
            collectionItem.id,
            categoryData
        );
        
        // Update the collection items context with the new category
        const collectionId = collectionItem.collection_id;
        if (collectionId && collectionItemsContext.callbacks?.[collectionId]?.addModel) {
            // Find the collection item in the context
            const collectionItems = collectionItemsContext[collectionId]?.loadedData || [];
            const itemIndex = collectionItems.findIndex((item: CollectionItem) => item.id === collectionItem.id);
            
            if (itemIndex !== -1) {
                // Create a copy of the collection item with the new category
                const updatedCollectionItem = { ...collectionItems[itemIndex] };
                
                // Initialize collection_item_categories if it doesn't exist
                if (!updatedCollectionItem.collection_item_categories) {
                    updatedCollectionItem.collection_item_categories = [];
                }
                
                // Add the new category to the collection item
                // Make sure the category object has the expected structure
                const categoryWithName = {
                    ...newCollectionItemCategory,
                    category: {
                        id: category.id,
                        name: category.name
                    }
                };
                
                updatedCollectionItem.collection_item_categories.push(categoryWithName);
                
                // Update the collection item in the context
                collectionItemsContext.callbacks[collectionId].addModel(updatedCollectionItem);
            }
        }
    } catch (error) {
        console.error('Error adding category:', error);
    } finally {
        setLoadingCategoryId(null);
    }
};

// Function to remove a category from a collection item
const handleRemoveCategory = async (
    collection: Collection,
    collectionItemCategory: CollectionItemCategory,
    setLoadingCategoryId: (id: number | null) => void,
    collectionItemsContext: any
): Promise<void> => {
    if (!collectionItemCategory || !collectionItemCategory.id) return;
    
    setLoadingCategoryId(collectionItemCategory.category_id);
    
    try {
        // Delete the collection item category
        await CollectionManagementRequests.deleteCollectionItemCategory(collectionItemCategory.id);
        
        // Update the collection items context by removing the category
        const collectionId = collection.id;
        if (collectionId && collectionItemsContext.callbacks?.[collectionId]?.removeModel) {
            // Find the collection item in the context
            const collectionItems = collectionItemsContext[collectionId]?.loadedData || [];
            const itemIndex = collectionItems.findIndex((item: CollectionItem) => 
                item.id === collectionItemCategory.collection_item_id
            );
            
            if (itemIndex !== -1) {
                // Create a copy of the collection item
                const updatedCollectionItem = { ...collectionItems[itemIndex] };
                
                // Initialize collection_item_categories if it doesn't exist
                if (!updatedCollectionItem.collection_item_categories) {
                    updatedCollectionItem.collection_item_categories = [];
                }
                
                // Remove the category from the collection item
                updatedCollectionItem.collection_item_categories = updatedCollectionItem.collection_item_categories.filter(
                    (category: CollectionItemCategory) => category.id !== collectionItemCategory.id
                );
                
                // Update the collection item in the context
                collectionItemsContext.callbacks[collectionId].addModel(updatedCollectionItem);
            }
        }
    } catch (error) {
        console.error('Error removing category:', error);
    } finally {
        setLoadingCategoryId(null);
    }
};

// Component props interface
interface CollectionItemProps {
    collection: Collection;
    release: Release;
    collectionItemsContext: CollectionItemsContextState;
    isBulkOperation?: boolean;
    selectedItems?: Set<number>;
    isCommonCollection?: boolean;
}

const CollectionItemComponent: React.FC<CollectionItemProps> = ({
    collection,
    release,
    collectionItemsContext,
    isBulkOperation = false,
    selectedItems,
    isCommonCollection = false
}) => {
    const [loadingCollectionId, setLoadingCollectionId] = useState<number | null>(null);
    const [loadingCategoryId, setLoadingCategoryId] = useState<number | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<{[key: number]: Category}>({});
    const categoryAutocompleteRef = useRef<{ clearInput: () => void } | null>(null);

    const isInCollection = isReleaseInCollection(release, collectionItemsContext[collection.id!]?.loadedData ?? []);
    const collectionItem = isInCollection ? getCollectionItemForRelease(release, collection, collectionItemsContext) : null;
    const categories = collectionItem?.collection_item_categories || [];

    // Get selected releases for bulk operation
    const selectedReleases = useMemo(() => {
        if (!isBulkOperation || !selectedItems) return [];
        // Get all releases that are selected but not already in the collection
        const collectionState = collectionItemsContext[collection.id!];
        const existingItemIds = new Set(collectionState?.loadedData?.map(item => item.item_id) ?? []);
        return Array.from(selectedItems)
            .filter(itemId => !existingItemIds.has(itemId))
            .map(itemId => ({ id: itemId } as Release));
    }, [isBulkOperation, selectedItems, collectionItemsContext, collection.id]);

    // Function to handle category selection
    const handleCategorySelect = async (category: Category) => {
        if (!collection.id || !category || !collectionItem) return;
        
        setSelectedCategories(prev => ({
            ...prev,
            [collection.id!]: category
        }));
        
        // Add the category to the collection item
        await handleAddCategory(
            collectionItem,
            category,
            setLoadingCategoryId,
            collectionItemsContext
        );
        
        // Clear the CategoryAutocomplete input after successful addition
        if (categoryAutocompleteRef.current && typeof categoryAutocompleteRef.current.clearInput === 'function') {
            categoryAutocompleteRef.current.clearInput();
        }
    };

    return (
        <li className="collection-item">
            <Stack gap="xs">
                <div className="collection-info">
                    <div className="collection-name">{collection.name}</div>
                    <div className="collection-count">{collection.collection_items_count}</div>
                </div>
                
                {isInCollection && collectionItem && collectionItem.id && (
                    <>
                        <div className="collection-categories">
                            <Text size="sm" fw={500} mb="xs">Categories:</Text>
                            {categories.length > 0 ? (
                                <ul className="collection-item-categories-list">
                                    {categories.map((category: CollectionItemCategory) => {
                                        return (
                                            <li key={category.id} className="category-item">
                                                <span className="category-name">{category.category.name}</span>
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    size="sm"
                                                    onClick={() => handleRemoveCategory(
                                                        collection,
                                                        category,
                                                        setLoadingCategoryId,
                                                        collectionItemsContext
                                                    )}
                                                >
                                                    <IconTrash size={14} />
                                                </ActionIcon>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <Text size="sm" c="dimmed">No categories added</Text>
                            )}
                        </div>
                        
                        <CategoryAutocomplete
                            onSelect={(category) => handleCategorySelect(category)}
                            prioritizedCategories={collectionItem?.collection_item_categories?.map(cic => cic.category) || []}
                            placeholder="Add a category..."
                            ref={(el) => {
                                if (el) {
                                    categoryAutocompleteRef.current = el;
                                }
                            }}
                        />
                    </>
                )}
                
                <div className="collection-actions">
                    {isInCollection ? (
                        <Button
                            size="xs"
                            variant="light"
                            color="red"
                            leftSection={<IconX size={14} />}
                            loading={loadingCollectionId === collection.id}
                            onClick={() => handleRemoveFromCollection(
                                release,
                                collection,
                                collectionItemsContext,
                                setLoadingCollectionId
                            )}
                        >
                            Remove
                        </Button>
                    ) : (
                        <Button
                            size="xs"
                            variant="light"
                            color="blue"
                            leftSection={<IconPlus size={14} />}
                            loading={loadingCollectionId === collection.id}
                            onClick={() => {
                                if (isBulkOperation && selectedReleases.length > 0) {
                                    handleBulkAddToCollection(
                                        selectedReleases,
                                        collection,
                                        collectionItemsContext,
                                        setLoadingCollectionId
                                    );
                                } else {
                                    handleAddToCollection(
                                        release,
                                        collection,
                                        collectionItemsContext,
                                        setLoadingCollectionId
                                    );
                                }
                            }}
                        >
                            {isBulkOperation ? `Add ${selectedReleases.length} Items` : 'Add'}
                        </Button>
                    )}
                </div>
            </Stack>
        </li>
    );
};

export default CollectionItemComponent; 