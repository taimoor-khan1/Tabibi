import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './Reducers';
import {createLogger} from 'redux-logger';

const store = createStore(
  reducers,
  {},
  applyMiddleware(
    ReduxThunk,
    createLogger({collapsed: true})
  ),
);

export default store;
