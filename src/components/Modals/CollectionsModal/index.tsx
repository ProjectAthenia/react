import React, { useState, useEffect } from 'react';
import { Modal, Button, Stack, Text, Group, ActionIcon, TextInput } from '@mantine/core';
import { IconPlus, IconX, IconTrash } from '@tabler/icons-react';
import { CollectionItemsContext } from '../../../contexts/CollectionItemsContext';
import Collection from '../../../models/user/collection';
import CollectionItem from '../../../models/user/collection-items';
import CategoryAutocomplete from '../../GeneralUIElements/CategoryAutocomplete';
import Category from '../../../models/category';
import { CollectionItemCategory } from '../../../models/user/collection-item-category';
import CollectionManagementRequests from '../../../services/requests/CollectionManagementRequests';
import { CollectionItemsContextState } from '../../../contexts/CollectionItemsContext';
import './index.scss';
import { HasType } from '../../../models/has-type';
import GameMuseumModal, { ModalProps } from '../../GeneralUIElements/Modal';
import CollectionItemComponent from './CollectionItem';

interface CollectionsModalProps extends ModalProps {
    items: HasType | Set<HasType>;
    collections: Collection[];
    isLoading?: boolean;
    commonCollections?: Set<number>;
}

const CollectionsModal: React.FC<CollectionsModalProps> = ({ 
    isOpen,
    onRequestClose,
    items,
    collections,
    commonCollections = new Set()
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCollections, setFilteredCollections] = useState<Collection[]>(collections);
    const isBulkOperation = items instanceof Set;

    useEffect(() => {
        if (searchQuery) {
            const filtered = collections.filter(collection => 
                (collection as any).name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCollections(filtered);
        } else {
            setFilteredCollections(collections);
        }
    }, [searchQuery, collections]);

    // Get the first item for display purposes, ensuring we have a valid item
    const firstItem = isBulkOperation 
        ? (items as Set<HasType>).size > 0 
            ? (items as Set<HasType>).values().next().value 
            : { id: 0, type: 'unknown' } as HasType
        : items as HasType;

    return (
        <GameMuseumModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={isBulkOperation 
                ? `Collections for ${(items as Set<HasType>).size} Items`
                : `Collections for ${(items as HasType).type.charAt(0).toUpperCase() + (items as HasType).type.slice(1)}`
            }
        >
            <CollectionItemsContext.Consumer>
                {(collectionItemsContext) => (
                    <div className="collections-modal-content">
                        <h3>Your Collections</h3>
                        <Stack>
                            <TextInput
                                placeholder="Search collections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <ul className="collections-list">
                                {filteredCollections.map(collection => (
                                    <CollectionItemComponent
                                        key={collection.id}
                                        collection={collection}
                                        item={firstItem}
                                        collectionItemsContext={collectionItemsContext}
                                        isBulkOperation={isBulkOperation}
                                        selectedItems={isBulkOperation ? items as Set<HasType> : undefined}
                                        isCommonCollection={commonCollections.has(collection.id!)}
                                    />
                                ))}
                            </ul>
                        </Stack>
                    </div>
                )}
            </CollectionItemsContext.Consumer>
        </GameMuseumModal>
    );
};

export default CollectionsModal; 