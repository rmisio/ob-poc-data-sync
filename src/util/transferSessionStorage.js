import { store } from 'index';
import { sessionLoginSet } from 'actions/user';

const transferSessionStorage = event => {
  if (event.key === 'getSessionStorage') {
    // another tab asked for the sessionStorage -> send it
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    // the other tab should now have it, so we're done with it.
    localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
  } else if (event.key === 'sessionStorage' && !sessionStorage.length &&
    event.newValue.login !== 'explicit-logout') {
    // another tab sent data <- get it
    const data = JSON.parse(event.newValue);

    for (var key in data) {
      sessionStorage.setItem(key, data[key]);
    }

    if (data.login) {
      store.dispatch(sessionLoginSet());
    }
  }
};

window.addEventListener('storage', transferSessionStorage, false);

export default function() {
  if (!sessionStorage.length) {
    localStorage.setItem('getSessionStorage', 'blah');
    localStorage.removeItem('getSessionStorage', 'blah');
  }
}
