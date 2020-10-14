import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAthunticated } from "./index";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAthunticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/admin/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
