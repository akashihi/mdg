import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import 'whatwg-fetch';

import store from './reducers/rootReducer';
import Main from './components/Main';
import { SnackbarProvider } from 'notistack';

const App = () => (
    <Router>
        <Provider store={store}>
            <SnackbarProvider>
                <Main />
            </SnackbarProvider>
        </Provider>
    </Router>
);

const main = document.getElementById('main');
if (!main) {
    console.log('#main is not defined');
} else {
    createRoot(main).render(<App />);
}
