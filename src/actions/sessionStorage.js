export const REQUEST_SESSION_STORAGE = 'REQUEST_SESSION_STORAGE';
export const SESSION_STORAGE_SET = 'SESSION_STORAGE_SET';

let storageRequested = false;

const sessionLoginSet = () => {
  return {
    type: 'sessionLoginSet',
  }
}

const onStorage = (event, dispatch) => {
  if (event.key === 'getSessionStorage') {
    // another tab asked for the sessionStorage -> send it
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    // the other tab should now have it, so we're done with it.
    localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
  } else if (event.key === 'sessionStorage' &&
    event.newValue.login !== 'explicit-logout') {
    // another tab sent data <- store it
    const data = JSON.parse(event.newValue);

    for (var key in data) {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, data[key]);
      }
    }

    if (data.login) {
      dispatch(sessionLoginSet());
    }
  }
};

export const requestSessionStorage = (props = {}) => {
  if (storageRequested) {
    throw new Error('Session storage has already been requested.');
  }

  return function(dispatch) {
    window.addEventListener('storage', (e) => onStorage(e, dispatch), false);
    localStorage.setItem('getSessionStorage', 'blah');
    localStorage.removeItem('getSessionStorage', 'blah');
    storageRequested = true;
  }
};