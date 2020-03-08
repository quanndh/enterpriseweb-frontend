import request from './request';

export default {
    signup: (data) => {
        return request('/api/user/signup', data, 'POST')
    },
    login: (data) => {
        return request('/api/user/login', data, 'POST')
    },

}