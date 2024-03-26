/**
 * Code originally imported from https://github.com/jungsoft/react-deck-swiper
 */
export enum SWIPER_DIRECTIONS {
    LEFT = 'left',
    RIGHT = 'right',
}

export const getDirection = (offset: number) => (
    offset > 0
        ? SWIPER_DIRECTIONS.RIGHT
        : SWIPER_DIRECTIONS.LEFT
);

export const getOffset = (start: number, end: number) => -((start - end) * 0.75);

export const getEvent = (e: any) => (e.touches ? e.touches[0] : e);

export const withX = (fn: any) => (e: any) => fn(getEvent(e).pageX);

export const getLimitOffset = (limit: number, direction: string) => (
    direction === SWIPER_DIRECTIONS.RIGHT
        ? limit
        : -limit
);

