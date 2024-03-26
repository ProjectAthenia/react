export function combineReducers<R extends any>(reducers: R) {
    type keys = keyof typeof reducers;
    type returnType = { [K in keys]: ReturnType<any> }
    const combinedReducer = (state: any, action: any) => {
        const newState: returnType = {} as any;
        const keys = Object.keys(reducers as any);
        keys.forEach(key => {
            const result = (reducers as any)[key](state[key], action);
            newState[key as keys] = result || state[key];
        });
        return newState;
    }
    return combinedReducer;
}
