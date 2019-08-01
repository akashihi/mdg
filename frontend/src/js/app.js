import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'

import 'whatwg-fetch';

import rootReducer from './reducers/rootReducer'
import Main from './components/Main'

const history = createBrowserHistory();
const router = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer(history), {}, composeEnhancers(applyMiddleware(thunk, router)));

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Main/>
        </ConnectedRouter>
    </Provider>
);

render(<App/>, document.getElementById('main'));
