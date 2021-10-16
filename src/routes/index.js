import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';

//-----------------------|| ROUTING RENDER ||-----------------------//

const Routes = () => {
  return (
    <Switch>
      <React.Fragment>
        <MainRoutes />
        <Route exact path="/">
          <Redirect from="/" to="/farm" />
        </Route>

        {/* <Redirect from="/" to="/farm" /> */}
      </React.Fragment>
    </Switch>
  );
};

export default Routes;
