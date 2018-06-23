import { createStore, applyMiddleware } from 'redux';
import { history } from './';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';

export default initialState => {
  return createStore(
    rootReducer,
    applyMiddleware(
      routerMiddleware(history),
      thunk,
    )
  );
};
