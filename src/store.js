import { createStore, applyMiddleware } from 'redux';
import { history } from './';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import persistLogin from 'middleware/persistLogin';
import rootReducer from 'reducers';
import { initialState as initialUserState } from 'reducers/user';

let lsLogin = localStorage.getItem('login');
lsLogin = lsLogin && JSON.parse(lsLogin);

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
    applyMiddleware(
      thunk,
      routerMiddleware(history),
      persistLogin,
    )
  );
};
