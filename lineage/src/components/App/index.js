import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch} from 'react-router'

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import AboutUs from '../AboutUs';
import Shop from '../Shop';
import Form from '../Family/Form';
import Search from '../Search';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      <div className="container-body">
        <Switch>
          <Route path={ROUTES.SIGN_UP} exact component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} exact component={SignInPage} />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ABOUT_US} exact component={AboutUs} />
          <Route path={ROUTES.SHOP} exact component={Shop} />
          <Route path={ROUTES.FAMILY_TREE} exact component={Form} />
          <Route path={ROUTES.SEARCH} exact component={Search} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default withAuthentication(App);
