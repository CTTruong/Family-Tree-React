import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './styles.css';

const SignInPage = (props) => (
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
    <SignInForm {...props} />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  signInButton:"Sign In",
  disabled:false
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

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      signInButton:"Please Wait...",
      disabled:true
    });
    const { email, password } = this.state;
    const _ = this;event.persist();
    await this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(async () => {
        await _.props.firebase.auth.onAuthStateChanged(function(authUser) {
          if (authUser) {
            _.props.setTreeData({});
            _.props.firebase.user(authUser.uid)
              .once('value')
              .then(snapshot => {
                const dbUser = snapshot.val();

                // default empty roles
                // merge auth and db user
                authUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  emailVerified: authUser.emailVerified,
                  providerData: authUser.providerData,
                  ...dbUser,
                };
                _.props.onSetUsers(authUser);
                _.setState({ ...INITIAL_STATE },()=>{
                  _.props.history.push(ROUTES.HOME);
                });
          });
          } else {
            // No user is signed in.
          }
        });

      })
      .catch(error => {
        this.setState({ error,signInButton:"Sign In",disabled:false });
      });


  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error, disabled } = this.state;

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
          <button className="pbtn paper paper-raise-flatten" disabled={isInvalid||disabled} type="submit">
            {this.state.signInButton}
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.userState.users
});
const mapDispatchToProps = dispatch => ({
  onSetUsers: user  => {
    return dispatch({ type: 'AUTH_USER_SET', user })
  },
  setTreeData: tree => dispatch({ type: 'SET_TREE_DATA', tree })
});

const SignInForm = compose(
  withRouter,
  withFirebase,
  connect(mapStateToProps,mapDispatchToProps)
)(SignInFormBase);


export default SignInPage;
