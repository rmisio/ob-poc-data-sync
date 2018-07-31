import {
  LOGGED_IN,
  PROFILE_SET,
  LOGGED_OUT,
} from 'actions/user';

const storeLsLogin = store => next => action => {
  const curState = store.getState();
  const result = next(action);
  const nextState = store.getState();

  if (action.type === LOGGED_IN || action.type === PROFILE_SET) {
    const lsLogin = {
      lastLoginPeerId: nextState.user.lastLoginPeerId,
      lastLoginType: nextState.user.lastLoginType,
      encryptedLogins: nextState.user.encryptedLogins,
    };
    localStorage.setItem('login', JSON.stringify(lsLogin));

    if (action.type === LOGGED_IN) {
      sessionStorage.setItem('sessionLogin', action.seed);
    }
  }

  // if (action.type === LOGGED_OUT) {
  //   sessionStorage.setItem('sessionLogin', JSON.stringify({
  //     peerId: curState.user.peerId,
  //     seed: SESSION_LOGIN_EXPLICIT_LOGOUT,
  //   }));
  // }

  return result;
}

export default storeLsLogin;