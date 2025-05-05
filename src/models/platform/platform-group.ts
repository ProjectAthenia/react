import BaseModel from "../base-model";
import Platform from "./platform";

export default interface PlatformGroup extends BaseModel {

    /**
     * The name of the platform group
     */
    name: string,

    /**
     * How many unique games were released on this group of platforms
     */
    total_games: number,

    /**
     * All platforms within this group
     */
    platforms?: Platform[]
}