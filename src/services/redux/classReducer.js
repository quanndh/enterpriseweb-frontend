let initialState = {
    classList: [],
    classInfo: {}
}

const classReducer = (state = initialState, action) => {
    let tempList = [...state.classList]
    let tempClassInfo = { ...state.classInfo }
    console.log(tempClassInfo, 123)
    switch (action.type) {
        case 'SET_LIST_CLASS':
            return { ...state, classList: action.data }
        case 'ADD_CLASS':
            return { ...state, classList: [...state.classList, action.data] }
        case 'UPDATE_CLASS':
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.id) {
                    tempList[i].title = action.data.title
                    tempList[i].desc = action.data.desc
                    tempList[i].isActive = action.data.isActive
                    break;
                }
            }
            return { ...state, classList: [...tempList] }
        case "DELETE_CLASS":
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.id) {
                    tempList.splice(i, 1)
                    break;
                }
            }
            return { ...state, classList: [...tempList] }
        case 'REMOVE_STUDENT':
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.classId) {
                    tempList[i].students = tempList[i].students.filter(s => s.id !== action.data.studentId)
                }
            }
            return { ...state, classList: [...tempList] }
        case 'ADD_STUDENT_CLASS':
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.classId) {
                    tempList[i].students = [...tempList[i].students, ...action.data.students]
                }
            }
            return { ...state, classList: [...tempList] }
        case 'UPDATE_CLASS_TUTOR':
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].id === action.data.classId) {
                    tempList[i].tutor = action.data.tutor
                }
            }
            return { ...state, classList: [...tempList] }
        case 'SET_CLASS_DETAIL':
            return { ...state, classInfo: action.data }
        case 'ADD_NEW_POST':
            let tempBlogs = tempClassInfo.blogs;
            tempBlogs = [action.data, ...tempBlogs]
            return { ...state, classInfo: { ...tempClassInfo, blogs: tempBlogs } }
        default:
            return state
    }
}

export default classReducer;