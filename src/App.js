import React from 'react';
import { Provider } from 'react-redux';

import Router from './router';
import { configureAppStore } from './redux/store';
import './app.css';

const store = configureAppStore();

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
