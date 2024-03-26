import {ActionType} from '../../util/types';


export const incrementLoadingCount = () => ({
    type: 'increment-loading-count',
} as const);

export const decrementLoadingCount = () => ({
    type: 'decrement-loading-count',
} as const);

export const clearLoadingCount = () => ({
    type: 'clear-loading-count',
} as const);

export type SessionActions =
    | ActionType<typeof incrementLoadingCount>
    | ActionType<typeof decrementLoadingCount>
    | ActionType<typeof clearLoadingCount>
