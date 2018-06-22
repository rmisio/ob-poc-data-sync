import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginRequired from 'components/LoginRequired';
// import './Profile.css';

class Profile extends Component {
  render() {
    let content = <p style={{textAlign: 'center'}}>Profile coming soon.</p>;

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