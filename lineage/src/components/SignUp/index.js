import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import '../SignIn/styles.css';

const SignUpPage = () => (
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
  <SignUpForm />
</div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead.
`;

const PERMISSION_DENIED = "PERMISSION_DENIED"
const MISSING_CONTINUE_URL = "auth/missing-continue-uri"


class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          email
        });
      })
      .then(() => {
        this.props.setTreeData({});
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        if (error.code === PERMISSION_DENIED) {
          this.props.setTreeData({});
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
        }
        if (error.code === MISSING_CONTINUE_URL) {
          this.props.setTreeData({});
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === ''

    return (
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
        <button disabled={isInvalid} className="pbtn paper paper-raise-flatten" type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Need an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const mapDispatchToProps = (dispatch) =>({
  setTreeData: tree => dispatch({ type: 'SET_TREE_DATA', tree })
})

const SignUpForm = compose(
  withRouter,
  withFirebase,
  connect(null,mapDispatchToProps)
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
