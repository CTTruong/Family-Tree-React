import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from "react-router";

import { withFirebase } from '../Firebase';
import { Add } from '../Family';
import { SIGN_IN, FAMILY_TREE } from '../../constants/routes';

class HomePage extends Component {
  componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.props.onSetUsers(snapshot.val());
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  onAddClick = () => {
    this.props.authUser ? (
      this.props.history.push(FAMILY_TREE)
    ) : (
        this.props.history.push(SIGN_IN)
      );
  }

  render() {
    return (
      <div>
        <h1>Start your family tree here</h1>
        <div onClick={this.onAddClick}>
          <Add />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.userState.users,
  authUser: state.sessionState.authUser,
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

const condition = authUser => !!authUser;

export default compose(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomePage);
