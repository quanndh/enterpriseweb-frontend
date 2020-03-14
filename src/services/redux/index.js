import { combineReducers } from "redux";
import uiReducer from './uiReducer';
import userReducer from './userReducer'
import classReducer from './classReducer';

export default combineReducers({ uiReducer, userReducer, classReducer });