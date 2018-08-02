import { createStore, applyMiddleware } from 'redux';
import { history } from './';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import persistLogin from 'middleware/persistLogin';
import rootReducer from 'reducers';
import { initialState as initialUserState } from 'reducers/user';

let lsLogin = localStorage.getItem('login');
lsLogin = lsLogin && JSON.parse(lsLogin);

const middlewares = [
  thunk,
  routerMiddleware(history),
  persistLogin,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

export default initialState => {
  return createStore(
    rootReducer,
    {
      user: {
        ...initialUserState,
        ...lsLogin,
        initialSessionLogin: sessionStorage.getItem('sessionLogin'),
      },
    },
    applyMiddleware(...middlewares),
  );
};
