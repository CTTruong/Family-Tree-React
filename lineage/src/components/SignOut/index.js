import React from 'react';

import { withFirebase } from '../Firebase';
import {LinkContainer} from 'react-router-bootstrap';
const SignOutButton = ({ firebase,children }) => (
  <LinkContainer to="" type="button" onClick={firebase.doSignOut}>
    {children}
  </LinkContainer>
);

export default withFirebase(SignOutButton);
