import BaseModel from "../base-model";
import Release from "./release";

export default interface Game extends BaseModel {
    /**
     * The name of the game
     */
    name: string;

    /**
     * The IGDB ID for this game
     */
    igdb_id?: number;

    /**
     * The ID of the franchise this game belongs to
     */
    franchise_id?: number;

    /**
     * The critic rating for this game
     */
    critic_rating?: number;

    /**
     * The user rating for this game
     */
    user_rating?: number;

    /**
     * The URL to the game's source page
     */
    source_url?: string;

    /**
     * How many critic ratings this game has received
     */
    critic_rating_count?: number;

    /**
     * How many user ratings this game has received
     */
    user_rating_count?: number;

    /**
     * All releases of this game
     */
    releases?: Release[];
} 