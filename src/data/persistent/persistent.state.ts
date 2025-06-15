export interface TokenState {
    token: string;
    receivedAt: number;
}

export default interface PersistentState {
    tokenData?: TokenState;
    managingBusinessId?: number;
}

export const initialPersistentState: PersistentState = {
}
