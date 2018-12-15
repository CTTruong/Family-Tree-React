import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import Logo from './logo.jpg';
import './styles.css'
const Navigation = ({ authUser }) =>
  authUser ? (
    <NavigationAuth authUser={authUser} />
  ) : (
    <NavigationNonAuth />
  );

const NavigationAuth = ({ authUser }) => (
  <Navbar>
    <div class="side-crop col-md-6 col-md-offset-0 col-xs-offset-2 col-xs-10 col-sm-offset-2 col-sm-10">
      <Link to={ROUTES.HOME}>
        <img src={Logo} alt="lineage" />
      </Link>
    </div>
    <Nav pullRight={true}>
      <NavItem eventKey={1} >
      <Link to={ROUTES.FAMILY_TREE}>Add Family</Link>
      </NavItem>
      <NavItem eventKey={2} >
        <Link to={ROUTES.SHOP}>Shop</Link>
      </NavItem>
      <NavItem eventKey={3} >
        <Link to={ROUTES.ABOUT_US}>About Us</Link>
      </NavItem>
      <NavItem eventKey={4} >
        <SignOutButton />
      </NavItem>
    </Nav>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar>
    <div class="side-crop col-md-6 col-md-offset-0 col-xs-offset-2 col-xs-10 col-sm-offset-2 col-sm-10">
      <Link to={ROUTES.HOME}>
        <img src={Logo} alt="lineage" />
      </Link>
    </div>
    <Nav pullRight={true}>
      <NavItem eventKey={2} >
      <Link to={ROUTES.SIGN_IN}>Add Family</Link>
      </NavItem>
      <NavItem eventKey={3} >
        <Link to={ROUTES.SHOP}>Shop</Link>
      </NavItem>
      <NavItem eventKey={4} >
      <Link to={ROUTES.ABOUT_US}>About Us</Link>
      </NavItem>
      <NavItem eventKey={5} >
      <Link to={ROUTES.SIGN_IN}>Login/Register</Link>
      </NavItem>
    </Nav>
  </Navbar>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
