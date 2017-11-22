import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import $ from 'jquery';
import { Modal } from 'antd';
import API_URL from '../common/url';

const PrivateRoute = ({ component: ComposedComponent, ...rest }) => {
    return (
        <Route
            {...rest} render={props => {
                return (
                    <ComposedComponent {...props} name="" />
                );
            }}
        />
    );
};

export default PrivateRoute;
