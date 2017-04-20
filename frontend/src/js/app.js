import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Main from './components/Main'

const App = () => (
    <MuiThemeProvider>
        <Main />
    </MuiThemeProvider>
);

render(<App/>, document.getElementById("main"))
