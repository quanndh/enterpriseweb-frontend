const initialState = {
    initiatorData: {},
    peers: []
}

const meetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_INITIATOR':
            return { ...state, initiatorData: action.data }
        case 'SET_PEER':
            return { ...state, peers: [...state.peers, action.data] }
        default:
            return state
    }
}

export default meetingReducer;