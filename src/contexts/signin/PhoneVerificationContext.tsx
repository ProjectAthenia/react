export interface PhoneVerificationContextData {
    phone: string,
    phoneInvalid?: boolean,
    verification_code?: number,
}

export interface PhoneVerificationContextStateConsumer<T extends PhoneVerificationContextData> {
    data: T,
    setData: (data: T) => void,
}

export function createDefaultPhoneVerificationContextState<T extends PhoneVerificationContextData>(persistedState: T): PhoneVerificationContextStateConsumer<T> {
    return {
        data: persistedState,
        setData: (data: T) => {},
    }
}
