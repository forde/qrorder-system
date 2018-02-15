import { combineReducers } from 'redux';
import authReducer from './views/auth/reducer';

export default combineReducers({
  auth: authReducer
});