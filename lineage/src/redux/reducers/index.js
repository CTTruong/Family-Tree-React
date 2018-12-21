import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import relationReducer from './relation';
import treeReducer from './tree';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  relation: relationReducer,
  treeState: treeReducer
});

export default rootReducer;
