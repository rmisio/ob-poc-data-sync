import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginRequired from 'components/LoginRequired';
// import './Profile.css';

class Profile extends Component {
  render() {
    let content = (
      <div style={{textAlign: 'center'}}>
        <h2>Profile not set</h2>
        <p>You either entered the wrong seed when you logged in or your local browser does not have your data and the sync with the remote hasn't completed. Unless your internet is out, you probably entered the wrong seed.</p>
      </div>
    );

    if (!this.props.user.loggedIn) {
      content = <LoginRequired />;
    }

    return (
      <div className="Profile">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state, prop) {
  return {
    // router: state.router,
    // modals: state.modals,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      // modalActions: bindActionCreators(ModalActions, dispatch),
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);