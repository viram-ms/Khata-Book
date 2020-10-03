import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {useStateValue} from './StateProvider';
const AuthRoute = ({ component: Component,render, ...rest }) => {
    console.log(localStorage.getItem('token'))
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          localStorage.getItem('token') != null 
        ) {
          return <Component {...props} render={render}/>;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          );
        }
      }}
    />
  );
};

export default AuthRoute;
