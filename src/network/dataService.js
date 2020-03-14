import request from './request';

export default {
    signup: (data) => {
        return request('/api/user/signup', data, 'POST')
    },
    login: (data) => {
        return request('/api/user/login', data, 'POST')
    },
    getUserList: (data) => {
        return request('/api/user/get-list-user', data, 'POST')
    },
    createUser: (data) => {
        return request('/api/user/create-user', data, 'POST')
    },
    getUserActivity: (data) => {
        return request('/api/user/get-activity', data, 'POST')
    },
    updateUser: data => {
        return request('/api/user/update-user', data, 'PATCH')
    },
    deleteUser: data => {
        return request('/api/user/delete-user', data, 'POST')
    },
    getClassList: data => {
        return request('/api/class/get-list', data, 'POST')
    },
    createClass: data => {
        return request('/api/user/create-class', data, 'POST')
    },
    removeStudentFromClass: data => {
        return request('/api/class/remove-student', data, 'PATCH')
    },
    getListStudent: (data) => {
        return request('/api/class/get-available-student', data, 'POST')
    },
    assignToClass: data => {
        return request('/api/user/assign-user-to-class', data, 'PATCH')
    },
    getAvailableTutor: data => {
        return request('/api/class/get-available-tutor', data, 'POST')
    }
}