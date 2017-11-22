import { combineReducers } from 'redux';
import investigationReducer from './investigationReducer';

const reducers = combineReducers({
    investigationState: investigationReducer,
});

export default reducers;
