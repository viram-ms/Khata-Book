export const initialState = {
    user: null,
    id: null
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_USER_ID: "SET_USER_ID"
}

const reducer = (state,action) => {
    console.log(action);
    switch(action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.SET_USER_ID:
            return {
                ...state,
                id: action.id,
            }
        default:

            return state;
    }
};

export default reducer;