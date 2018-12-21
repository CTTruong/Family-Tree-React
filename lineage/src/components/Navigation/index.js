import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaSearch } from 'react-icons/fa';

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
    <div className="side-crop col-md-6 col-md-offset-0 col-xs-offset-2 col-xs-10 col-sm-offset-2 col-sm-10">
      <Link to={ROUTES.HOME}>
        <img src={Logo} alt="lineage" />
      </Link>
    </div>

    <Nav pullRight={true}>
      <LinkContainer to={ROUTES.FAMILY_TREE}>
        <NavItem eventKey={1} >
          Add Family
      </NavItem>
      </LinkContainer>
      <LinkContainer to={ROUTES.SEARCH}>
        <NavItem eventKey={1} >
        <FaSearch size={11} />&nbsp;&nbsp;Search
      </NavItem>
      </LinkContainer>

      <LinkContainer to={ROUTES.SHOP}><NavItem eventKey={2} >
        Shop
      </NavItem></LinkContainer>
      <LinkContainer to={ROUTES.ABOUT_US}><NavItem eventKey={3} >
        About Us
      </NavItem></LinkContainer>
      <SignOutButton>
        <NavItem eventKey={4} >
          Sign Out
        </NavItem>
      </SignOutButton>
    </Nav>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar>
    <div className="side-crop col-md-6 col-md-offset-0 col-xs-offset-2 col-xs-10 col-sm-offset-2 col-sm-10">
      <Link to={ROUTES.HOME}>
        <img src={Logo} alt="lineage" />
      </Link>
    </div>
    <Nav pullRight={true}>
      <LinkContainer to={ROUTES.SIGN_IN}><NavItem eventKey={1} >Add Family</NavItem></LinkContainer>
      <LinkContainer to={ROUTES.SEARCH}>
        <NavItem eventKey={1} >
        <FaSearch /> Search
      </NavItem>
      </LinkContainer>
      <LinkContainer to={ROUTES.SHOP}><NavItem eventKey={3} >
        Shop
      </NavItem></LinkContainer>
      <LinkContainer to={ROUTES.ABOUT_US}><NavItem eventKey={4} >
        About Us
      </NavItem>
      </LinkContainer>   <LinkContainer to={ROUTES.SIGN_IN}><NavItem eventKey={5} >
        Login/Register
      </NavItem>
      </LinkContainer> </Nav>
  </Navbar>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
