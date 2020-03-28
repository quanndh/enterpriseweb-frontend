import { combineReducers } from "redux";
import uiReducer from './uiReducer';
import userReducer from './userReducer'
import classReducer from './classReducer';
import meetingReducer from './meetingReducer';

export default combineReducers({ uiReducer, userReducer, classReducer, meetingReducer });