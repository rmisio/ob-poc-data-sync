import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
// import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import Store from 'store';
import App from 'components/App';
import 'index.css';
import 'style/containers.css';

export const history = createHistory();
const store = Store();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// registerServiceWorker();
