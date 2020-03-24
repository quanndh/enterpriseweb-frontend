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
    },
    changeClassState: data => {
        return request('/api/class/update-class', data, 'PATCH')
    },
    getUserClass: data => {
        return request('/api/user/get-class', data, 'POST');
    },
    getOneClassDetail: data => {
        return request('/api/user/get-one-class-detail', data, 'POST')
    },
    createPost: data => {
        return request('/api/user/create-blog', data, 'POST')
    },
    addCommentToPost: data => {
        return request('/api/user/comment', data, 'POST')
    },
    deletePost: data => {
        return request('/api/user/delete-blog', data, 'DELETE')
    },
    deleteComment: data => {
        return request('/api/user/delete-comment', data, 'DELETE')
    },
    downloadFile: data => {
        return request('api/file/download-file', data, 'POST')
    },
    createMeeting: data => {
        return request('/api/user/create-meeting', data, 'POST')
    },
    joinMeeting: data => {
        return request('/api/user/join-meeting', data, 'POST')
    },
    closeMeeting: data => {
        return request('/api/user/close-meeting', data, "PATCH")
    },
    getOnlineUser: data => {
        return request('/api/meeting/online', data, 'POST')
    },
    userChangePassword: data => {
        return request('/api/user/change-password', data, 'PATCH')
    },
    getMessageCount: data => {
        return request('/api/report/count-message', data, 'POST')
    },
    getBlogCount: data => {
        return request('/api/report/blog-count', data, 'POST')
    },
    getNewUserCount: data => {
        return request('/api/report/new-user-count', data, 'POST')
    },
    getMeetingTime: data => {
        return request('/api/report/meeting-time', data, 'POST')
    },
    getOverallStat: data => {
        return request('/api/report/overall-stat', data, 'POST')
    },
    getUnactiveStudent: data => {
        return request('/api/report/get-unactive-student', data, 'POST')
    }

}