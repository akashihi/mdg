import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import rootReducer from './reducers/rootReducer'
import Main from './components/Main'


const store = createStore(rootReducer, {}, applyMiddleware(thunk));

const App = () => (
    <Provider store={store}>
        <MuiThemeProvider>
            <Main />
        </MuiThemeProvider>
    </Provider>
);

render(<App/>, document.getElementById('main'));
