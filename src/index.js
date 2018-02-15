import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import reducers from './reducers';
import './css/index.css';


const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

const AppWrapper = () => {
    return (
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    );
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'));
registerServiceWorker();
