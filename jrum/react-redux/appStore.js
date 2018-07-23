import thunk from 'redux-thunk';
import rootReducer from './reducer';
import {createStore,applyMiddleware} from 'redux';

const AppStore = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default AppStore;