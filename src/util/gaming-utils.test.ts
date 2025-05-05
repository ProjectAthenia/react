import { sortPlatforms, calculateAggregateScore, calculateReleaseAggregateScore, isReleaseInAnyCollection, isReleaseInCollection, getCollectionItemForRelease } from './gaming-utils';
import Platform from '../models/platform/platform';
import PlatformGroup from '../models/platform/platform-group';
import Game from '../models/game/game';
import Release from '../models/game/release';
import CollectionItem, { CollectionItemType } from '../models/user/collection-items';
import Collection from '../models/user/collection';

describe('gaming-utils', () => {
    describe('sortPlatforms', () => {
        it('should return an empty array when given an empty array', () => {
            const result = sortPlatforms([]);
            expect(result).toEqual([]);
        });

        it('should handle platforms without groups', () => {
            const platforms: Platform[] = [
                { id: 1, name: 'Platform A' } as Platform,
                { id: 2, name: 'Platform B' } as Platform,
                { id: 3, name: 'Platform C' } as Platform,
            ];

            const result = sortPlatforms(platforms);
            expect(result).toEqual(platforms);
        });

        it('should group platforms by their platform_group', () => {
            const group1: PlatformGroup = { 
                id: 1, 
                name: 'Group 2', 
                platforms: [],
                total_games: 0
            };
            const group2: PlatformGroup = { 
                id: 2, 
                name: 'Group 1', 
                platforms: [],
                total_games: 0
            };

            const platforms: Platform[] = [
                { id: 1, name: 'Platform C', platform_group: group1 } as Platform,
                { id: 2, name: 'Platform A', platform_group: group1 } as Platform,
                { id: 3, name: 'Platform B', platform_group: group1 } as Platform,
                { id: 4, name: 'Platform E', platform_group: group2 } as Platform,
                { id: 5, name: 'Platform D', platform_group: group2 } as Platform,
                { id: 6, name: 'Platform F' } as Platform,
            ];

            const result = sortPlatforms(platforms);
            expect(result.length).toBe(3); // 2 groups + 1 standalone platform

            // Check that all items are sorted by name
            expect((result[0] as PlatformGroup).name).toBe('Group 1');
            expect((result[1] as PlatformGroup).name).toBe('Group 2');
            expect((result[2] as Platform).name).toBe('Platform F');

            // Check that platforms are correctly grouped and sorted by name
            const group1Result = result[0] as PlatformGroup;
            expect(group1Result.platforms?.length).toBe(2);
            expect(group1Result.platforms?.map(p => p.name)).toEqual(['Platform D', 'Platform E']);

            const group2Result = result[1] as PlatformGroup;
            expect(group2Result.platforms?.length).toBe(3);
            expect(group2Result.platforms?.map(p => p.name)).toEqual(['Platform A', 'Platform B', 'Platform C']);
        });

        it('should handle platforms with undefined groups', () => {
            const platforms: Platform[] = [
                { id: 1, name: 'Platform A', platform_group: undefined } as Platform,
                { id: 2, name: 'Platform B' } as Platform,
            ];

            const result = sortPlatforms(platforms);
            expect(result).toEqual(platforms);
        });

        it('should handle groups without a platforms array', () => {
            const group: PlatformGroup = { 
                id: 1, 
                name: 'Group 1',
                total_games: 0
            };
            const platforms: Platform[] = [
                { id: 1, name: 'Platform A', platform_group: group } as Platform,
            ];

            const result = sortPlatforms(platforms);
            expect(result.length).toBe(1);
            expect((result[0] as PlatformGroup).platforms?.length).toBe(1);
        });
    });

    describe('calculateAggregateScore', () => {
        it('should calculate aggregate score with both critic and user ratings', () => {
            const game: Game = {
                id: 1,
                name: 'Test Game',
                critic_rating: 8.5,
                user_rating: 7.5,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const score = calculateAggregateScore(game);
            expect(score).toBeCloseTo(8.2, 1); // 8.5 * 0.7 + 7.5 * 0.3 = 8.2
        });

        it('should use only critic rating if user rating is missing', () => {
            const game: Game = {
                id: 1,
                name: 'Test Game',
                critic_rating: 8.5,
                user_rating: undefined,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const score = calculateAggregateScore(game);
            expect(score).toBe(8.5);
        });

        it('should use only user rating if critic rating is missing', () => {
            const game: Game = {
                id: 1,
                name: 'Test Game',
                critic_rating: undefined,
                user_rating: 7.5,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const score = calculateAggregateScore(game);
            expect(score).toBe(7.5);
        });

        it('should return null if both ratings are missing', () => {
            const game: Game = {
                id: 1,
                name: 'Test Game',
                critic_rating: undefined,
                user_rating: undefined,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const score = calculateAggregateScore(game);
            expect(score).toBeNull();
        });
    });

    describe('calculateReleaseAggregateScore', () => {
        it('should calculate aggregate score for a release with game', () => {
            const game: Game = {
                id: 1,
                name: 'Test Game',
                critic_rating: 8.5,
                user_rating: 7.5,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const release: Release = {
                id: 1,
                game_id: 1,
                platform_id: 1,
                release_date: '2023-01-01',
                release_type: 'retail',
                game: game,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const score = calculateReleaseAggregateScore(release);
            expect(score).toBeCloseTo(8.2, 1); // 8.5 * 0.7 + 7.5 * 0.3 = 8.2
        });

        it('should return null if release has no game', () => {
            const release: Release = {
                id: 1,
                game_id: 1,
                platform_id: 1,
                release_date: '2023-01-01',
                release_type: 'retail',
                game: undefined,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const score = calculateReleaseAggregateScore(release);
            expect(score).toBeNull();
        });
    });

    describe('isReleaseInCollection', () => {
        it('should return true if release is in the collection', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItems: CollectionItem[] = [
                { 
                    id: 1, 
                    collection_id: 1, 
                    item_id: 123, 
                    item_type: 'release' as CollectionItemType, 
                    created_at: '2023-01-01', 
                    updated_at: '2023-01-01',
                    order: 1
                },
                { 
                    id: 2, 
                    collection_id: 1, 
                    item_id: 456, 
                    item_type: 'release' as CollectionItemType, 
                    created_at: '2023-01-01', 
                    updated_at: '2023-01-01',
                    order: 2
                }
            ];

            const result = isReleaseInCollection(release, collectionItems);
            expect(result).toBe(true);
        });

        it('should return false if release is not in the collection', () => {
            const release: Release = {
                id: 999,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItems: CollectionItem[] = [
                { 
                    id: 1, 
                    collection_id: 1, 
                    item_id: 123, 
                    item_type: 'release' as CollectionItemType, 
                    created_at: '2023-01-01', 
                    updated_at: '2023-01-01',
                    order: 1
                }
            ];

            const result = isReleaseInCollection(release, collectionItems);
            expect(result).toBe(false);
        });

        it('should return false if collection items is empty', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const result = isReleaseInCollection(release, []);
            expect(result).toBe(false);
        });

        it('should return false if item type is not release', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItems: CollectionItem[] = [
                { 
                    id: 1, 
                    collection_id: 1, 
                    item_id: 123, 
                    item_type: 'post' as CollectionItemType,
                    created_at: '2023-01-01', 
                    updated_at: '2023-01-01',
                    order: 1
                }
            ];

            const result = isReleaseInCollection(release, collectionItems);
            expect(result).toBe(false);
        });
    });

    describe('getCollectionItemForRelease', () => {
        it('should find the collection item for a release in a collection', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collection: Collection = {
                id: 1,
                name: 'Test Collection',
                created_at: '2023-01-01',
                updated_at: '2023-01-01',
                owner_id: 1,
                owner_type: 'user',
                is_public: true
            };

            const collectionItem: CollectionItem = { 
                id: 1, 
                collection_id: 1, 
                item_id: 123, 
                item_type: 'release' as CollectionItemType, 
                created_at: '2023-01-01', 
                updated_at: '2023-01-01',
                order: 1
            };

            const collectionItemsContext = {
                1: {
                    hasAnotherPage: false,
                    initialLoadComplete: true,
                    initiated: true,
                    noResults: false,
                    refreshing: false,
                    expands: [],
                    order: {},
                    filter: {},
                    search: {},
                    limit: 20,
                    loadedData: [
                        collectionItem
                    ],
                    loadAll: false,
                    params: {},
                    loadNext: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    refreshData: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setFilter: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setSearch: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setOrder: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    addModel: () => {},
                    removeModel: () => {},
                    getModel: () => null,
                    total: 1
                }
            };

            const result = getCollectionItemForRelease(release, collection, collectionItemsContext);
            expect(result).toEqual(collectionItem);
        });

        it('should return null if release is not in the collection', () => {
            const release: Release = {
                id: 999,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collection: Collection = {
                id: 1,
                name: 'Test Collection',
                created_at: '2023-01-01',
                updated_at: '2023-01-01',
                owner_id: 1,
                owner_type: 'user',
                is_public: true
            };

            const collectionItemsContext = {
                1: {
                    hasAnotherPage: false,
                    initialLoadComplete: true,
                    initiated: true,
                    noResults: false,
                    refreshing: false,
                    expands: [],
                    order: {},
                    filter: {},
                    search: {},
                    limit: 20,
                    loadedData: [
                        { 
                            id: 1, 
                            collection_id: 1, 
                            item_id: 123, 
                            item_type: 'release' as CollectionItemType, 
                            created_at: '2023-01-01', 
                            updated_at: '2023-01-01',
                            order: 1
                        } as CollectionItem
                    ],
                    loadAll: false,
                    params: {},
                    loadNext: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    refreshData: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setFilter: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setSearch: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setOrder: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    addModel: () => {},
                    removeModel: () => {},
                    getModel: () => null,
                    total: 1
                }
            };

            const result = getCollectionItemForRelease(release, collection, collectionItemsContext);
            expect(result).toBeNull();
        });

        it('should return null if collection is not in context', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collection: Collection = {
                id: 2, // This collection ID is not in the context
                name: 'Test Collection',
                created_at: '2023-01-01',
                updated_at: '2023-01-01',
                owner_id: 1,
                owner_type: 'user',
                is_public: true
            };

            const collectionItemsContext = {
                1: {
                    hasAnotherPage: false,
                    initialLoadComplete: true,
                    initiated: true,
                    noResults: false,
                    refreshing: false,
                    expands: [],
                    order: {},
                    filter: {},
                    search: {},
                    limit: 20,
                    loadedData: [
                        { 
                            id: 1, 
                            collection_id: 1, 
                            item_id: 123, 
                            item_type: 'release' as CollectionItemType, 
                            created_at: '2023-01-01', 
                            updated_at: '2023-01-01',
                            order: 1
                        } as CollectionItem
                    ],
                    loadAll: false,
                    params: {},
                    loadNext: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    refreshData: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setFilter: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setSearch: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    setOrder: () => Promise.resolve({ data: [], current_page: 1, last_page: 1, total: 0 }),
                    addModel: () => {},
                    removeModel: () => {},
                    getModel: () => null,
                    total: 1
                }
            };

            const result = getCollectionItemForRelease(release, collection, collectionItemsContext);
            expect(result).toBeNull();
        });

        it('should return null if release, collection or collectionItemsContext is undefined', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collection: Collection = {
                id: 1,
                name: 'Test Collection',
                created_at: '2023-01-01',
                updated_at: '2023-01-01',
                owner_id: 1,
                owner_type: 'user',
                is_public: true
            };

            // Test with undefined release
            expect(getCollectionItemForRelease(undefined as any, collection, {})).toBeNull();
            
            // Test with undefined collection
            expect(getCollectionItemForRelease(release, undefined as any, {})).toBeNull();
            
            // Test with undefined collectionItemsContext
            expect(getCollectionItemForRelease(release, collection, undefined as any)).toBeNull();
            
            // Test with collection that has no id
            expect(getCollectionItemForRelease(release, {} as Collection, {})).toBeNull();
        });
    });

    describe('isReleaseInAnyCollection', () => {
        it('should return true if release is in any collection', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItemsMap: Record<number, { loadedData: CollectionItem[] }> = {
                1: {
                    loadedData: [
                        { 
                            id: 1, 
                            collection_id: 1, 
                            item_id: 123, 
                            item_type: 'release' as CollectionItemType, 
                            created_at: '2023-01-01', 
                            updated_at: '2023-01-01',
                            order: 1
                        }
                    ]
                },
                2: {
                    loadedData: [
                        { 
                            id: 2, 
                            collection_id: 2, 
                            item_id: 456, 
                            item_type: 'release' as CollectionItemType, 
                            created_at: '2023-01-01', 
                            updated_at: '2023-01-01',
                            order: 1
                        }
                    ]
                }
            };

            const result = isReleaseInAnyCollection(release, collectionItemsMap);
            expect(result).toBe(true);
        });

        it('should return false if release is not in any collection', () => {
            const release: Release = {
                id: 999,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItemsMap: Record<number, { loadedData: CollectionItem[] }> = {
                1: {
                    loadedData: [
                        { 
                            id: 1, 
                            collection_id: 1, 
                            item_id: 123, 
                            item_type: 'release' as CollectionItemType, 
                            created_at: '2023-01-01', 
                            updated_at: '2023-01-01',
                            order: 1
                        }
                    ]
                }
            };

            const result = isReleaseInAnyCollection(release, collectionItemsMap);
            expect(result).toBe(false);
        });

        it('should return false if collection items map is empty', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const result = isReleaseInAnyCollection(release, {});
            expect(result).toBe(false);
        });

        it('should handle collections with empty loadedData', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItemsMap: Record<number, { loadedData: CollectionItem[] }> = {
                1: {
                    loadedData: []
                }
            };

            const result = isReleaseInAnyCollection(release, collectionItemsMap);
            expect(result).toBe(false);
        });

        it('should handle collections with undefined loadedData', () => {
            const release: Release = {
                id: 123,
                game_id: 456,
                platform_id: 789,
                release_date: '2023-01-01',
                release_type: 'retail',
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            const collectionItemsMap: Record<number, { loadedData: CollectionItem[] }> = {
                1: {
                    loadedData: undefined as any
                }
            };

            const result = isReleaseInAnyCollection(release, collectionItemsMap);
            expect(result).toBe(false);
        });
    });
}); 