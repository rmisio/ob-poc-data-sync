import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker';
import { remove } from 'util/array';
import transferSessionStorage from 'util/transferSessionStorage';
import { Provider } from 'react-redux';
import Store from 'store';
import 'index.css';
import App from 'components/App';

export const history = createHistory();
export const store = Store();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
transferSessionStorage();
