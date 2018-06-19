import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'actions/user';
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
    this.props.actions.logout();
  }

  handleAvatarClick = event => {
    this.setState({ menuOpen: !this.state.menuOpen });
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
                <Avatar url={this.props.user.avatar} />
              </div>
            </a>
          </div>
          {popUpMenu}
        </nav>
      )
    } else {
      return (
        <nav className="LoginMenu">
          <a>Login</a>
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
    actions: bindActionCreators(UserActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginMenu);