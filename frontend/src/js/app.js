import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import rootReducer from './reducers/rootReducer'
import Main from './components/Main'


const store = createStore(rootReducer, {});

const App = () => (
    <Provider store={store}>
        <MuiThemeProvider>
            <Main />
        </MuiThemeProvider>
    </Provider>
);

render(<App/>, document.getElementById('main'));
