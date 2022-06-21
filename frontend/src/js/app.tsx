import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { Map } from 'immutable';

import 'whatwg-fetch';

import rootReducer from './reducers/rootReducer';
import Main from './components/Main';

const store = createStore(rootReducer(), Map(), compose(applyMiddleware(thunk)));

const App = () => (
  <Router>
    <Provider store={store}>
      <Main />
    </Provider>
  </Router>
)

createRoot(document.getElementById('main')).render(<App />)
