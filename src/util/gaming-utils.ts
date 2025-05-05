import Platform from "../models/platform/platform";
import PlatformGroup from "../models/platform/platform-group";
import Game from "../models/game/game";
import Release from "../models/game/release";
import CollectionItem from "../models/user/collection-items";
import Collection from "../models/user/collection";
import { CollectionItemsContextState } from '../contexts/CollectionItemsContext';

/**
 * A type that can be either a Platform or a PlatformGroup
 */
export type PlatformOrGroup = Platform | PlatformGroup;

/**
 * Sorts a list of platforms into a mixed list of platform groups and standalone platforms.
 * Platforms that belong to a group will be nested under their group.
 * 
 * @param platforms The list of platforms to sort
 * @returns A sorted list of platform groups and standalone platforms
 */
export function sortPlatforms(platforms: Platform[]): PlatformOrGroup[] {
    // Create a map of platform groups
    const groupMap = new Map<number, PlatformGroup>();
    
    // First pass: collect all platform groups
    platforms.forEach(platform => {
        if (platform.platform_group?.id) {
            groupMap.set(platform.platform_group.id, platform.platform_group);
        }
    });
    
    // Second pass: organize platforms into their groups
    platforms.forEach(platform => {
        if (platform.platform_group?.id) {
            const group = groupMap.get(platform.platform_group.id);
            if (group) {
                if (!group.platforms) {
                    group.platforms = [];
                }
                group.platforms.push(platform);
            }
        }
    });
    
    // Sort platforms within each group by name
    groupMap.forEach(group => {
        if (group.platforms) {
            group.platforms.sort((a, b) => a.name.localeCompare(b.name));
        }
    });
    
    // Convert the map to an array
    const groups = Array.from(groupMap.values());
    
    // Get standalone platforms (those without a group)
    const standalonePlatforms = platforms
        .filter(platform => !platform.platform_group);
    
    // Combine groups and standalone platforms
    const combined = [...groups, ...standalonePlatforms];
    
    // Sort all items by name
    return combined.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Calculates the aggregate score for a game based on critic and user ratings.
 * The aggregate score is a weighted average of critic and user scores.
 * 
 * @param game The game to calculate the aggregate score for
 * @param criticWeight The weight to give to critic scores (default: 0.7)
 * @param userWeight The weight to give to user scores (default: 0.3)
 * @returns The calculated aggregate score, or null if no ratings are available
 */
export function calculateAggregateScore(
    game: Game, 
    criticWeight: number = 0.7, 
    userWeight: number = 0.3
): number | null {
    // Ensure weights sum to 1
    const totalWeight = criticWeight + userWeight;
    if (Math.abs(totalWeight - 1) > 0.001) {
        criticWeight = criticWeight / totalWeight;
        userWeight = userWeight / totalWeight;
    }

    // Check if we have any ratings
    const hasCriticRating = game.critic_rating !== undefined && game.critic_rating !== null;
    const hasUserRating = game.user_rating !== undefined && game.user_rating !== null;

    // If we have both ratings, calculate weighted average
    if (hasCriticRating && hasUserRating) {
        return (game.critic_rating! * criticWeight) + (game.user_rating! * userWeight);
    }
    
    // If we only have critic rating, use that
    if (hasCriticRating) {
        return game.critic_rating!;
    }
    
    // If we only have user rating, use that
    if (hasUserRating) {
        return game.user_rating!;
    }
    
    // If we have no ratings, return null
    return null;
}

/**
 * Calculates the aggregate score for a release based on its game's critic and user ratings.
 * 
 * @param release The release to calculate the aggregate score for
 * @param criticWeight The weight to give to critic scores (default: 0.7)
 * @param userWeight The weight to give to user scores (default: 0.3)
 * @returns The calculated aggregate score, or null if no ratings are available
 */
export function calculateReleaseAggregateScore(
    release: Release,
    criticWeight: number = 0.7,
    userWeight: number = 0.3
): number | null {
    if (!release.game) {
        return null;
    }
    
    return calculateAggregateScore(release.game, criticWeight, userWeight);
}

/**
 * Checks if a release is in a specific collection based on its items.
 * 
 * @param release The release to check
 * @param collectionItems The list of collection items to check against
 * @returns True if the release is in the collection, false otherwise
 */
export function isReleaseInCollection(
    release: Release,
    collectionItems: CollectionItem[]
): boolean {
    return collectionItems.find((item: CollectionItem) => 
        item.item_type === 'release' && item.item_id === release.id
    ) !== undefined;
}

/**
 * Gets the collection item for a release in a specific collection.
 * 
 * @param release The release to find the collection item for
 * @param collection The collection to look in
 * @param collectionItemsContext The context containing collection items data
 * @returns The collection item if found, null otherwise
 */
export function getCollectionItemForRelease(
    release: Release,
    collection: Collection,
    collectionItemsContext: CollectionItemsContextState
): CollectionItem | null {
    if (!release || !collection || !collection.id || !collectionItemsContext || !collectionItemsContext[collection.id]) return null;
    
    const collectionItems = collectionItemsContext[collection.id].loadedData || [];
    return collectionItems.find((item: CollectionItem) => 
        item.item_type === 'release' && item.item_id === release.id
    ) || null;
}

/**
 * Checks if a release is in any collection based on the collection items map.
 * 
 * @param release The release to check
 * @param collectionItemsMap A map of collection IDs to their items
 * @returns True if the release is in any collection, false otherwise
 */
export function isReleaseInAnyCollection(
    release: Release, 
    collectionItemsMap: Record<number, { loadedData: CollectionItem[] }> = {}
): boolean {
    // Check all collection items in the map
    return Object.values(collectionItemsMap).find(collectionData => {
        const collectionItems = collectionData.loadedData || [];
        return isReleaseInCollection(release, collectionItems);
    }) !== undefined;
} 