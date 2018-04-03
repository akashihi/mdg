import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware} from 'react-router-redux'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import 'whatwg-fetch';

import rootReducer from './reducers/rootReducer'
import Main from './components/Main'

const history = createHistory()
const router = routerMiddleware(history)
const store = createStore(rootReducer, {}, applyMiddleware(thunk, router));

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MuiThemeProvider>
                <Main store={store}/>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>
);

render(<App/>, document.getElementById('main'));
