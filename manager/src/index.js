import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import routes from './router';
import store from './store';
import PrivateRoute from './auth/PrivateRoute';
import App from './components/App';
import 'babel-polyfill';
import './style/main.less';

ReactDOM.render(

    <Provider store={store}>
        <HashRouter>
            <App>
                <Switch>
                {
                    routes.map((route, index) => (
                        <PrivateRoute
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.render}
                        />))
                }
                </Switch>
            </App>
        </HashRouter>
    </Provider>,
    document.getElementById('content'),
);
