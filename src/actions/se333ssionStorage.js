export const CROSSTAB_LOGIN_CHANGE = 'CROSSTAB_LOGIN_CHANGE';

const crosstabLoginChange = peerId => {
  return {
    type: CROSSTAB_LOGIN_CHANGE,
  }
}

let prevSessionLogin = sessionStorage.getItem('login');

const onSessionStorage = (event, dispatch) => {
  if (event.key === 'getSessionStorage') {
    // another tab asked for the sessionStorage -> send it
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    // the other tab should now have it, so we're done with it.
    localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
  } else if (event.key === 'sessionStorage') {
    // another tab sent data <- store it
    const data = JSON.parse(event.newValue);

    if (data.login !== prevSessionLogin) {
      dispatch(crosstabLoginChange(data.login))
    }

    for (var key in data) {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, data[key]);
      }
    }
  }
};

let storageRequested = false;

// todo: should this just be request sessionLogin and focus just on that key?
export const requestSessionStorage = (props = {}) => {
  if (storageRequested) {
    throw new Error('Session storage has already been requested.');
  }

  return function(dispatch) {
    window.addEventListener('storage', (e) => onSessionStorage(e, dispatch), false);
    localStorage.setItem('getSessionStorage', 'blah');
    localStorage.removeItem('getSessionStorage', 'blah');
    storageRequested = true;
  }
};

export const sendLogout = peerId => {
  if (typeof peerId !== 'string' || !peerId) {
    throw new Error('Please provide a peerId as a non-empty string.');
  }

  localStorage.setItem('logout', peerId);
  localStorage.removeItem('logout');
}

let listeningForLogout = false;

export const listenForLogout = () => {
  if (listeningForLogout) return;

  return function(dispatch) {
    window.addEventListener('storage', (e) => {
      if (e.key === 'logout') {

      }
    }, false);
  }
}