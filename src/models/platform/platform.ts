import BaseModel from "../base-model";
import PlatformGroup from "./platform-group";

export default interface Platform extends BaseModel {

    /**
     * The name of the platform
     */
    name: string,

    /**
     * How many unique games were released on the platform
     */
    total_games: number,

    /**
     * The id of the related platform group
     */
    platform_group_id?: number,

    /**
     * The group of platforms this is apart of if any
     */
    platform_group?: PlatformGroup,
}