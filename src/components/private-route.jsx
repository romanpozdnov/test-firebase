import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { currentUserSelector } from '../redux/slices/userSlice';

import { ROUTES } from '../constants';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector(currentUserSelector);
  const isAuthenticated = !!user.id;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: ROUTES.login,
            }}
          />
        )
      }
    />
  );
};
