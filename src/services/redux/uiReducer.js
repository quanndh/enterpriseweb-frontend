let initialState = {
    open: false,
    message: "",
    code: null,
    loading: false
}

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_UI':
            return { ...state, open: true, message: action.message, code: action.code }
        case 'HIDE_UI':
            return { ...state, open: false, message: "", code: null }
        case 'SHOW_LOADING':
            return { ...state, loading: true }
        case 'HIDE_LOADING':
            return { ...state, loading: false }
        default:
            return state;
    }
}

export default uiReducer;