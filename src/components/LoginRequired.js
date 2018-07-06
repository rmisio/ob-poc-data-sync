import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'actions/modals';

class LoginRequired extends Component {
  handleLoginClick = () => {
    this.props.actions.modalActions.openModal({ modalType: 'Login' });
  }

  render() {
    return (
      <div className="LoginRequired" style={{textAlign: 'center'}}>
        <p>You must be logged in to view this page. Please <a onClick={this.handleLoginClick}>log in</a>.</p>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      modalActions: bindActionCreators(ModalActions, dispatch),
    }
  };
}


export default connect(() => ({}), mapDispatchToProps)(LoginRequired);