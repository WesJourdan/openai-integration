/**
 * This files dynamically compiles the module routes for the client and
 * redirects any route that doesn't match to a 'NotFound'/404 page
 *
 * Below we import all module routes and assign them top-level pathnames as the
 * kebab-case version of their moduleName. For example in moduleRoutes.js.jsx:
 * export { default as userWorkouts } ... would become a top-level Route with the
 * path="/user-workouts" and so on.
 */

// import primary libraries
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import YTRoute from './global/routing/YTRoute.js.jsx';

// import third-party libraries
import _ from 'lodash';

// import custom components
import Forbidden from './modules/static/views/Forbidden.js.jsx';
import Landing from './modules/static/views/Landing.js.jsx';
import NotFound from './modules/static/views/NotFound.js.jsx';
import AdminDashboard from './modules/static/views/AdminDashboard.js.jsx';

// import main client and admin routes from the modules
import * as adminModuleRoutes from './modules/admin/adminModuleRoutes.js';
import * as moduleRoutes from './modules/moduleRoutes.js';

import AdminRouter from './modules/admin/AdminRouter.js.jsx';

const routes =
  <Switch>
    <Route exact path="/" component={Landing} />
    <Route path="/unauthorized" component={Forbidden} />
    { Object.keys(moduleRoutes).map((moduleName, i) =>
      <Route
        component={moduleRoutes[moduleName]}
        key={Math.floor(Math.random()*100000)}
        path={`/${_.kebabCase(moduleName)}`}
      />
    )}
    { Object.keys(adminModuleRoutes).map((moduleName, i) =>
      <YTRoute
        component={adminModuleRoutes[moduleName]}
        key={Math.floor(Math.random()*100000)}
        path={`/admin/${_.kebabCase(moduleName)}`}
        role="admin"
      />
    )}
    <AdminRouter/>
    <Route component={NotFound} />
  </Switch>
;

export default routes;
