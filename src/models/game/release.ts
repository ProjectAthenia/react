import BaseModel from "../base-model";
import Game from "./game";
import Platform from "../platform/platform";

export default interface Release extends BaseModel {
    /**
     * The ID of the region this release was for
     */
    region_id?: number;

    /**
     * The ID of the publisher for this release
     */
    publisher_id?: number;

    /**
     * The ID of the game this is a release for
     */
    game_id: number;

    /**
     * The ID of the platform this was released on
     */
    platform_id: number;

    /**
     * The date this version was released
     */
    release_date?: string;

    /**
     * The type of release (e.g., retail, digital, etc.)
     */
    release_type: string;

    /**
     * The game this release was for
     */
    game?: Game;

    /**
     * The platform this was released on
     */
    platform?: Platform;
} 