import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './styles.css';

const SignInPage = () => (
  <div className="card col-md-offset-3 
                    col-md-6 col-xs-offset-1 col-xs-10  
                    col-sm-offset-3 col-sm-6">
    <section>
      <div id="one">
        <Link to={ROUTES.SIGN_IN}>
          <h3>
            Login
          </h3>
        </Link>
      </div>
      <div id="two">
      <Link to={ROUTES.SIGN_UP}>
          <h3>
            Register
          </h3>
        </Link>
      </div>
    </section>
    <SignInForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div >
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              className="form-control" 
              placeholder="Email Address"
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              className="form-control" 
              placeholder="Password"
            />
          </div>
          <button className="pbtn paper paper-raise-flatten" disabled={isInvalid} type="submit">
            Sign In
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}



const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);


export default SignInPage;
