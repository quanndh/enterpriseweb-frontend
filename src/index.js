import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import rootReducers from './services/redux';
import { createStore, applyMiddleware } from 'redux';
import apiStore from './services/apiStore';
import logger from 'redux-logger'

const store = createStore(
    rootReducers,
    applyMiddleware(logger)
)

class AppContainer extends Component {
    constructor(props) {
        super(props);
        apiStore.setStore(store)
    }

    render() {
        return (
            <Provider store={store} >
                <App />
            </Provider>
        );
    }
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
