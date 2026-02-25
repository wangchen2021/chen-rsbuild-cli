import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { Inspector } from 'react-dev-inspector';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Inspector>
        <Provider store={store}>
          <App />
        </Provider>
      </Inspector>
    </React.StrictMode>,
  );
}
