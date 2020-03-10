let initialState = {
    user: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_INFO':
            return { ...state, user: action.data }
        default:
            return state
    }
}

export default userReducer;