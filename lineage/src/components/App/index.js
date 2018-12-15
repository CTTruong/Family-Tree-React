import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import AboutUs from '../AboutUs';
import Shop from '../Shop';
import Form from '../Family/Form';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />
      <div className="container-body">
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route exact path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ABOUT_US} component={AboutUs} />
        <Route path={ROUTES.SHOP} component={Shop} />
        <Route path={ROUTES.FAMILY_TREE} component={Form} />
      </div>
    </div>
  </Router>
);

export default withAuthentication(App);
