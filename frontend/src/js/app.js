import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware} from 'react-router-redux'

import 'whatwg-fetch';

import rootReducer from './reducers/rootReducer'
import Main from './components/Main'

const history = createHistory()
const router = routerMiddleware(history)
const store = createStore(rootReducer, {}, applyMiddleware(thunk, router));

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Main store={store}/>
        </ConnectedRouter>
    </Provider>
);

render(<App/>, document.getElementById('main'));
