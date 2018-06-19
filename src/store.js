import { createStore, applyMiddleware } from 'redux';
import rootReducer from 'reducers';
import { routerMiddleware } from 'react-router-redux';
import { history } from './';

export default initialState => {
  return createStore(
    rootReducer,
    applyMiddleware(
      routerMiddleware(history),
    )
  );
};
