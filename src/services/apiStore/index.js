let store = null;

export default {
    setStore: (newStore) => {
        store = newStore;
    },
    getToken: () => {
        if (store && store.getState().adminReducer.admin.token) {
            return store.getState().adminReducer.admin.token
        }
        return localStorage.getItem('TOKEN')
    },
    login: (adminInfo, token) => {
        store.dispatch({ type: 'SET_ADMIN_INFO', data: adminInfo })
        localStorage.setItem('TOKEN', token)
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo))
    },
    logout: () => {
        store.dispatch({ type: 'SET_ADMIN_INFO', data: {} })
        localStorage.removeItem("TOKEN")
        localStorage.removeItem("adminInfo")
    },
    showUi: (message, code) => {
        store.dispatch({ type: 'SHOW_UI', message, code })
    },
    hideUi: () => {
        store.dispatch({ type: 'HIDE_UI' })
    },
    actSetEmployees: (data) => {
        store.dispatch({ type: 'SET_EMP', data })
    },
    actUpdateEmployee: (data) => {
        store.dispatch({ type: 'UPDATE_EMP', data })
    },
    actDeleteEmployee: (data) => {
        store.dispatch({ type: 'DELETE_EMP', data })
    },
    actSetRequest: (data) => {
        store.dispatch({ type: 'SET_REQUEST', data })
    },
    actSetOffer: (data) => {
        store.dispatch({ type: 'SET_OFFER', data })
    },
    actShowLoading: (data) => {
        store.dispatch({ type: 'SHOW_LOADING' })
    },
    actHideLoading: (data) => {
        store.dispatch({ type: 'HIDE_LOADING' })
    }

}