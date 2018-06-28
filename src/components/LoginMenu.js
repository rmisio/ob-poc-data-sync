import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'actions/user';
import * as ModalActions from 'actions/modals';
import './LoginMenu.css';
import Avatar from 'components/Avatar';

class LoginMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
    this.wrapperRef = React.createRef();
    this.avatarWrapRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocClick);
  }

  handleDocClick = event => {
    if (
      this.wrapperRef && this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target) &&
      !(
        this.avatarWrapRef &&
        this.avatarWrapRef.current &&
        (this.avatarWrapRef.current.contains(event.target) ||
          event.target === this.avatarWrapRef.current)
      )
    ) {
      this.setState({ menuOpen: false });
    }
  }

  handleLogoutClick = event => {
    this.props.actions.user.logout();
    this.setState({ menuOpen: false });
  }

  handleAvatarClick = event => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleLoginClick = event => {
    this.props.actions.modals.openModal('Login');
  }

  render() {
    if (this.props.user.loggedIn) {
      let popUpMenu = null;

      if (this.state.menuOpen) {
        popUpMenu = (
          <nav ref={this.wrapperRef} className="LoginMenu-popUpMenu">
            <a onClick={this.handleLogoutClick}>Logout</a>
          </nav>          
        );
      }

      return (
        <nav ref={this.wrapperRef} className="LoginMenu">
          <a style={{color: 'transparent'}}>Login</a>
          <div className="LoginMenu-logoutWrap">
            <a onClick={this.handleAvatarClick} className="LoginMenu-logoutLink">
              <div ref={this.avatarWrapRef} className="LoginMenu-avatarWrap">
                <Avatar url={this.props.user.profile && this.props.user.profile.avatarUrl || ''} />
              </div>
            </a>
          </div>
          {popUpMenu}
        </nav>
      )
    } else {
      return (
        <nav className="LoginMenu">
          <a onClick={this.handleLoginClick}>Login</a>
        </nav>
      )      
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      user: bindActionCreators(UserActions, dispatch),
      modals: bindActionCreators(ModalActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginMenu);