import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'actions/user';
import * as ModalActions from 'actions/modals';
import Avatar from 'components/Avatar';
import OutsideClick from 'components/common/OutsideClick';
import './LoginMenu.css';

class LoginMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.avatarWrapRef = React.createRef();
  }

  handleDocClick = event => {
    if (
      !(
        this.avatarWrapRef &&
        this.avatarWrapRef.current &&
        (this.avatarWrapRef.current.contains(event.target) ||
          event.target === this.avatarWrapRef.current)
      )
    ) {
      this.setState({ menuOpen: false });
    }
  };

  handleLogoutClick = event => {
    this.props.actions.user.logout();
    this.setState({ menuOpen: false });
  };

  handleAvatarClick = event => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  handleLoginClick = event => {
    this.props.actions.modals.openModal({ modalType: 'login/Login' });
  };

  handleSwitchAccountClick = event => {
    const id = this.props.actions.modals.openModal({
      modalType: 'login/Login'
    });
    console.log(`opening modal ${id}`);
  };

  render() {
    let content;

    if (this.props.user.loggedIn) {
      let popUpMenu = null;

      if (this.state.menuOpen) {
        // todo: use some generic nav menu styling once we bring the styles over
        popUpMenu = (
          <nav className="LoginMenu-popUpMenu">
            <a className="displayBlock txLft" onClick={this.handleLogoutClick}>
              Logout
            </a>
            <a
              className="displayBlock txLft"
              onClick={this.handleSwitchAccountClick}
            >
              Switch Account
            </a>
          </nav>
        );
      }

      content = (
        <nav className="LoginMenu">
          <a style={{ color: 'transparent' }}>Login</a>
          <div className="LoginMenu-logoutWrap">
            <a
              onClick={this.handleAvatarClick}
              className="LoginMenu-logoutLink"
            >
              <div ref={this.avatarWrapRef} className="LoginMenu-avatarWrap">
                <Avatar
                  url={
                    (this.props.user.profile &&
                      this.props.user.profile.avatarUrl) ||
                    ''
                  }
                />
              </div>
            </a>
          </div>
          {popUpMenu}
        </nav>
      );
    } else {
      content = (
        <nav className="LoginMenu">
          <a onClick={this.handleLoginClick}>Login</a>
        </nav>
      );
    }

    return (
      <OutsideClick onOutsideClick={this.handleDocClick}>
        {content}
      </OutsideClick>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      user: bindActionCreators(UserActions, dispatch),
      modals: bindActionCreators(ModalActions, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginMenu);
