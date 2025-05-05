import React from 'react';
import { CollectionItemsContext } from '../../../contexts/CollectionItemsContext';
import Collection from '../../../models/user/collection';
import Release from '../../../models/game/release';
import GameMuseumModal, { ModalProps } from '../../GeneralUIElements/Modal';
import CollectionItemComponent from './CollectionItem';
import './index.scss';

interface CollectionsModalProps extends ModalProps {
    release: Release;
    collections: Collection[];
    isLoading?: boolean;
    isBulkOperation?: boolean;
    selectedItems?: Set<number>;
    commonCollections?: Set<number>;
}

const CollectionsModal: React.FC<CollectionsModalProps> = ({ 
    isOpen,
    onRequestClose,
    release, 
    collections,
    isBulkOperation = false,
    selectedItems,
    commonCollections = new Set()
}) => {
    return (
        <GameMuseumModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={isBulkOperation 
                ? `Add ${selectedItems?.size || 0} Items to Collections` 
                : `Collections for ${release?.game?.name || 'Game'}`
            }
        >
            <CollectionItemsContext.Consumer>
                {(collectionItemsContext) => (
                    <div className="collections-modal-content">
                        <h3>Your Collections</h3>
                        <ul className="collections-list">
                            {collections.map(collection => (
                                <CollectionItemComponent
                                    key={collection.id}
                                    collection={collection}
                                    release={release}
                                    collectionItemsContext={collectionItemsContext}
                                    isBulkOperation={isBulkOperation}
                                    selectedItems={selectedItems}
                                    isCommonCollection={commonCollections.has(collection.id!)}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </CollectionItemsContext.Consumer>
        </GameMuseumModal>
    );
};

export default CollectionsModal; 