export interface TokenState {
    token: string;
    receivedAt: number;
}

export interface PersistentState {
    tokenData?: TokenState;
    organizationInitiated?: boolean;
}

export const initialPersistentState: PersistentState = {
}
