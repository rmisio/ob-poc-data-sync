import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'actions/modals';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const matchedUrl = this.props.location.pathname.match(
      /([^/]+)\/([^/]+)\/([^/]+)/
    );

    if (matchedUrl) {
      this.props.actions.modals.openModal({
        modalType: 'SimpleMessage',
        title: 'Listings Are Delicious',
        body:
          'I am pleased to show you the butter bean silky smooth contents of ' +
          matchedUrl[3]
      });
    }

    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 3000);
  }

  render() {
    let Listing;

    if (this.state.isLoading) {
      return <div>I am loading. Feel the force of my flatulance!</div>;
    }

    return <div>I have loaded. I am supreme. I may have sharted</div>;
  }
}

function mapStateToProps(state, prop) {
  return {
    // router: state.router,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      modals: bindActionCreators(ModalActions, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage);
