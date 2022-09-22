import React from 'react';
import { Route, Navigate} from 'react-router-dom';
import { getToken } from './Common';

// handle the private routes
function PrivateRoute({ children  }) {
    return getToken() ? children : <Navigate to="/" />;
}

export default PrivateRoute;