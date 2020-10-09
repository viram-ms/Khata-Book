import React from "react";
import { Route, Redirect } from "react-router-dom";

const LoginRoute = ({ component:Component, render,  ...rest }) => {
    return (
        <Route
        {...rest}
        render={(props) => {
          if (
            localStorage.getItem('token') == null 
          ) {
            return <Component {...props} render={render} />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: '/dashboard',
                }}
              />
            );
          }
        }}
      />
    )
};

export default LoginRoute;
