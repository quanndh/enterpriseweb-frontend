let store = null;

export default {
    setStore: (newStore) => {
        store = newStore;
    },
    getToken: () => {
        if (store && store.getState().userReducer.user.token) {
            return store.getState().userReducer.user.token
        }
        return localStorage.getItem('TOKEN')
    },
    login: (userInfo, token) => {
        store.dispatch({ type: 'SET_USER_INFO', data: userInfo })
        localStorage.setItem('TOKEN', token)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    logout: () => {
        store.dispatch({ type: 'SET_USER_INFO', data: {} })
        localStorage.removeItem("TOKEN")
        localStorage.removeItem("userInfo")
    },
    showUi: (message, code) => {
        store.dispatch({ type: 'SHOW_UI', message, code })
    },
    hideUi: () => {
        store.dispatch({ type: 'HIDE_UI' })
    },
    actShowLoading: (data) => {
        store.dispatch({ type: 'SHOW_LOADING' })
    },
    actHideLoading: (data) => {
        store.dispatch({ type: 'HIDE_LOADING' })
    }

}