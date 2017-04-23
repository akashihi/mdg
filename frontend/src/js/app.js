import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Main from './components/Main'

const App = () => (
    <MuiThemeProvider>
        <Main />
    </MuiThemeProvider>
);

render(<App/>, document.getElementById("main"))
