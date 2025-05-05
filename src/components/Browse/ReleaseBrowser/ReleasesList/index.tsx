import React, { useState, useMemo, useEffect } from 'react';
import './index.scss';
import { ReleasesContextState } from '../../../../contexts/GamingComponents/ReleasesContext';
import { createColumnHelper } from '@tanstack/react-table';
import RangeFilter, { RangeFilterValue, rangeFilterFn } from '../../../GeneralUIElements/DataList/RangeFilter';
import DataList, { RangeFilterColumn } from '../../../GeneralUIElements/DataList';
import { UserCollectionsContext, UserCollectionsContextProvider, UserCollectionsContextState } from '../../../../contexts/UserCollectionsContext';
import { ActionIcon, Group, Text, Center, Loader, Badge, Button, Tooltip, Checkbox, Stack, LoadingOverlay } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconX, IconTrash, IconPlus } from '@tabler/icons-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { calculateReleaseAggregateScore, isReleaseInAnyCollection } from '../../../../util/gaming-utils';
import {
    CollectionItemContextState,
    CollectionItemsContext,
    CollectionItemsContextProvider,
    CollectionItemsContextState
} from '../../../../contexts/CollectionItemsContext';
import Release from "../../../../models/game/release";
import CollectionsModal from "../../../Modals/CollectionsModal";
import CollectionManagementRequests from '../../../../services/requests/CollectionManagementRequests';
import CollectionItem from '../../../../models/user/collection-items';

interface ReleasesListProps {
    contextState: ReleasesContextState;
    onYearChanged: (year: number | undefined) => void;
    userId?: number;
    collectionsContextState?: UserCollectionsContextState;
    collectionItemsContextState?: CollectionItemsContextState;
}

interface ColumnMeta {
    filterType?: 'year' | 'range';
}

const columnHelper = createColumnHelper<Release>();

const ReleasesList: React.FC<ReleasesListProps> = ({
    contextState, 
    onYearChanged, 
    userId,
    collectionsContextState,
    collectionItemsContextState
}) => {
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [excludedItems, setExcludedItems] = useState<Set<number>>(new Set());
    const [showOnlyInCollection, setShowOnlyInCollection] = useState(false);
    const [hideInCollection, setHideInCollection] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [isRemoving, setIsRemoving] = useState(false);
    const [isBulkOperation, setIsBulkOperation] = useState(false);

    const handleFilterChange = (columnId: string, value: string) => {
        if (columnId === 'release_date') {
            const year = value ? parseInt(value) : undefined;
            if (year && year > 1960) {
                onYearChanged(year);
            } else {
                onYearChanged(undefined);
            }
            return true;
        }
        return false;
    };

    const handleOpenCollectionsModal = (release: Release) => {
        setSelectedRelease(release);
        setIsBulkOperation(false);
        setIsModalOpen(true);
    };

    const handleExcludeItem = (releaseId: number) => {
        setExcludedItems(prev => {
            const newExcluded = new Set(prev);
            newExcluded.add(releaseId);
            return newExcluded;
        });
    };

    const handleIncludeAll = () => {
        setExcludedItems(new Set());
    };

    // Handle toggling "Show only in collections"
    const handleShowOnlyInCollection = (checked: boolean) => {
        setShowOnlyInCollection(checked);
        if (checked) {
            setHideInCollection(false);
        }
    };

    // Handle toggling "Hide items in collections"
    const handleHideInCollection = (checked: boolean) => {
        setHideInCollection(checked);
        if (checked) {
            setShowOnlyInCollection(false);
        }
    };

    const handleItemSelect = (releaseId: number) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(releaseId)) {
                newSelected.delete(releaseId);
            } else {
                newSelected.add(releaseId);
            }
            return newSelected;
        });
    };

    const handleBulkAddToCollection = () => {
        if (selectedItems.size > 0) {
            // Get the first selected release to use as a reference
            const firstRelease = contextState.loadedData.find(release => selectedItems.has(release.id!));
            if (firstRelease) {
                setSelectedRelease(firstRelease);
                setIsBulkOperation(true);
                setIsModalOpen(true);
            }
        }
    };

    const handleBulkRemoveFromCollection = async () => {
        if (!collectionItemsContextState || selectedItems.size === 0) return;

        setIsRemoving(true);
        try {
            // Get all collection items for the selected releases
            const collectionItemsToRemove: { collectionId: number; itemId: number }[] = [];
            
            // Find all collection items for the selected releases
            Object.entries(collectionItemsContextState).forEach(([collectionId, state]) => {
                if (typeof collectionId === 'string' && state.loadedData) {
                    state.loadedData.forEach((item: CollectionItem) => {
                        const itemId = item.item_id as number;
                        if (selectedItems.has(itemId)) {
                            collectionItemsToRemove.push({
                                collectionId: parseInt(collectionId),
                                itemId: item.id!
                            });
                        }
                    });
                }
            });

            // Remove each collection item
            for (const { collectionId, itemId } of collectionItemsToRemove) {
                const collectionItemContext: CollectionItemContextState|undefined = collectionItemsContextState[collectionId]
                
                if (collectionItemContext) {
                    const item = collectionItemContext.loadedData.find(i => i.id === itemId);
                    if (item) {
                        await CollectionManagementRequests.removeCollectionItem(item);
                        collectionItemContext.removeModel(item);
                    }
                }
            }

            // Clear selected items after successful removal
            setSelectedItems(new Set());
        } catch (error) {
            console.error('Error removing items from collections:', error);
        } finally {
            setIsRemoving(false);
        }
    };

    const hasSelectedItemsInCollections = useMemo(() => {
        if (!collectionItemsContextState || selectedItems.size === 0) return false;
        
        return Array.from(selectedItems).find(releaseId => {
            const release = contextState.loadedData.find(r => r.id === releaseId);
            return release && isReleaseInAnyCollection(release, collectionItemsContextState);
        }) != null;
    }, [selectedItems, contextState.loadedData, collectionItemsContextState]);

    // Get common collections for all selected items
    const commonCollections = useMemo(() => {
        if (!collectionItemsContextState || selectedItems.size === 0) return new Set<number>();

        const selectedReleases = contextState.loadedData.filter(release => selectedItems.has(release.id!));
        if (selectedReleases.length === 0) return new Set<number>();

        // Get collections that contain all selected releases
        const commonCollections = new Set<number>();

        Object.keys(collectionItemsContextState).forEach(collectionId => {
            const collectionItemContextState = collectionItemsContextState[parseInt(collectionId)];
            if (typeof collectionId === 'string' && collectionItemContextState.loadedData) {
                const collectionItems = collectionItemContextState.loadedData;
                const collectionIdNum = parseInt(collectionId);
                
                // Check if all selected releases are in this collection
                const allInCollection = selectedReleases.every(release => 
                    collectionItems.some(item => item.item_id === release.id)
                );
                
                if (allInCollection) {
                    commonCollections.add(collectionIdNum);
                }
            }
        });

        return commonCollections;
    }, [selectedItems, contextState.loadedData, collectionItemsContextState]);

    const columns = useMemo<ColumnDef<Release, any>[]>(
        () => [
            columnHelper.accessor('game.name', {
                header: 'Game',
                cell: (info) => info.getValue(),
                filterFn: 'includesString',
            }),
            columnHelper.accessor('release_date', {
                header: 'Release Date',
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
                filterFn: (row, columnId, filterValue) => {
                    const year = new Date(row.getValue(columnId)).getFullYear();
                    return year === parseInt(filterValue);
                },
                meta: {
                    filterType: 'year'
                } as ColumnMeta,
            }),
            columnHelper.accessor('game.critic_rating', {
                id: 'critic_rating',
                header: 'Critic Score',
                cell: (info) => info.getValue()?.toFixed(1) || '-',
                filterFn: (row, columnId, filterValue: RangeFilterValue) => {
                    return rangeFilterFn(row.getValue(columnId) as number | undefined, filterValue);
                },
                meta: {
                    filterType: 'range'
                } as ColumnMeta,
            }),
            columnHelper.accessor('game.user_rating', {
                id: 'user_rating',
                header: 'User Score',
                cell: (info) => info.getValue()?.toFixed(1) || '-',
                filterFn: (row, columnId, filterValue: RangeFilterValue) => {
                    return rangeFilterFn(row.getValue(columnId) as number | undefined, filterValue);
                },
                meta: {
                    filterType: 'range'
                } as ColumnMeta,
            }),
            {
                accessorFn: (row: Release) => calculateReleaseAggregateScore(row),
                id: 'aggregate_score',
                header: 'Aggregate Score',
                cell: (info) => {
                    const value = info.getValue() as number;
                    return value ? value.toFixed(1) : '-';
                },
                filterFn: (row: Row<Release>, columnId: string, filterValue: RangeFilterValue) => {
                    const value = calculateReleaseAggregateScore(row.original);
                    return rangeFilterFn(value, filterValue);
                },
                meta: {
                    filterType: 'range'
                } as ColumnMeta,
            },
            columnHelper.display({
                id: 'actions',
                header: '',
                cell: ({ row }) => {
                    const isInCollection = isReleaseInAnyCollection(
                        row.original, 
                        collectionItemsContextState || {}
                    );
                    
                    return (
                        <Group gap="xs" onClick={(e) => e.stopPropagation()} style={{ whiteSpace: 'nowrap', flexWrap: 'nowrap' }}>
                            <Tooltip label="Collection" position="top" withArrow>
                                <ActionIcon
                                    variant="subtle"
                                    color={isInCollection ? "red" : "blue"}
                                    onClick={() => handleOpenCollectionsModal(row.original)}
                                    aria-label="Collection"
                                >
                                    {isInCollection ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Exclude this game from results" position="top" withArrow>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleExcludeItem(row.original.id!)}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    );
                },
                meta: {
                    width: '100px'
                }
            }),
        ],
        [collectionItemsContextState, userId]
    );

    const arrangeData = (data: Release[]) => {
        let filtered = data.filter(
            release => !excludedItems.has(release.id!)
        );

        // Filter by collection status if either option is enabled
        if (collectionItemsContextState) {
            if (showOnlyInCollection) {
                filtered = filtered.filter(release =>
                    isReleaseInAnyCollection(release, collectionItemsContextState)
                );
            } else if (hideInCollection) {
                filtered = filtered.filter(release =>
                    !isReleaseInAnyCollection(release, collectionItemsContextState)
                );
            }
        }

        return filtered;
    }

    return (
        <Stack data-testid="releases-list">
            <LoadingOverlay visible={isRemoving} />
            <Group justify="space-between" mb="md">
                <Group>
                    <Group>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={handleBulkAddToCollection}
                            disabled={selectedItems.size === 0}
                        >
                            Add to Collection
                        </Button>
                        <Button
                            leftSection={<IconTrash size={16} />}
                            onClick={handleBulkRemoveFromCollection}
                            color="red"
                            disabled={!hasSelectedItemsInCollections}
                        >
                            Remove from Collection
                        </Button>
                    </Group>
                </Group>
                <Group gap="md">
                    {excludedItems.size > 0 ? (
                        <Badge color="red" size="lg">
                            {excludedItems.size} {excludedItems.size === 1 ? 'item' : 'items'} excluded
                        </Badge>
                    ) : <div />}
                    
                    <Group gap="md">
                        {collectionItemsContextState && (
                            <>
                                <Checkbox
                                    label="Show only in collections"
                                    checked={showOnlyInCollection}
                                    onChange={(event) => handleShowOnlyInCollection(event.currentTarget.checked)}
                                    size="sm"
                                />
                                <Checkbox
                                    label="Hide items in collections"
                                    checked={hideInCollection}
                                    onChange={(event) => handleHideInCollection(event.currentTarget.checked)}
                                    size="sm"
                                />
                            </>
                        )}
                        
                        {excludedItems.size > 0 && (
                            <Button 
                                variant="subtle" 
                                color="blue" 
                                size="xs" 
                                onClick={handleIncludeAll}
                            >
                                Include all
                            </Button>
                        )}
                    </Group>
                </Group>
            </Group>
            <DataList
                context={contextState}
                columns={columns}
                onArrangeData={arrangeData}
                onFilterChanged={handleFilterChange}
                rangeFields={{
                    critic_rating: {},
                    user_rating: {},
                    aggregate_score: {
                        valueCallback: (row: Release) => calculateReleaseAggregateScore(row),
                        disableServerSearch: true
                    }
                }}
                bulkSelectEnabled={true}
                onBulkSelect={handleItemSelect}
                selectedItems={selectedItems}
            />
            <CollectionsModal
                isOpen={isModalOpen}
                onRequestClose={() => {
                    setIsModalOpen(false);
                    if (isBulkOperation) {
                        setSelectedItems(new Set());
                    }
                }}
                release={selectedRelease!}
                collections={collectionsContextState?.loadedData || []}
                isLoading={collectionsContextState?.refreshing || false}
                isBulkOperation={isBulkOperation}
                selectedItems={selectedItems}
                commonCollections={commonCollections}
            />
        </Stack>
    );
};

export default ReleasesList; 