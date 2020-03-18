let initialState = {
    user: {},
    userList: [],
    activity: [],
    classList: []
}

const userReducer = (state = initialState, action) => {
    let tempList = [...state.userList];
    switch (action.type) {
        case 'SET_USER_INFO':
            return { ...state, user: action.data }
        case 'SET_USER_LIST':
            return { ...state, userList: action.data }
        case 'SET_ACTIVITY':
            return { ...state, activity: action.data }
        case 'INSERT_USER':
            return { ...state, userList: [...state.userList, action.data] }
        case 'UPDATE_USER':
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.id) {
                    tempList[i] = action.data
                    break;
                }
            }
            return { ...state, userList: [...tempList] }
        case "DELETE_USER":
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.id) {
                    tempList.splice(i, 1)
                    break;
                }
            }
            return { ...state, userList: [...tempList] }
        case "SET_CLASS_LIST":
            return { ...state, classList: action.data }
        default:
            return state
    }
}

export default userReducer;