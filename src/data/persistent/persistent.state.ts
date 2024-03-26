export interface TokenState {
    token: string;
    receivedAt: number;
}


export default interface PersistentState {
    tokenData?: TokenState;
}


export const initialPersistentState: PersistentState = {
}
