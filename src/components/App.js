import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { history } from 'index';
import * as ModalActions from 'actions/modals';
import { Route } from 'react-router'
import { Link } from 'react-router-dom';
import Home from 'components/Home';
import Profile from 'components/Profile';
import LoginMenu from 'components/LoginMenu';
// import Chat from './components/Chat';
import ModalRoot from 'components/modals/ModalRoot';
import pickle from 'images/pickle2.png';
import './App.css';
import 'style/form.css';
import 'style/layout.css';
import 'style/text.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.subs = [];
    this.state = {
      profile: {},
      profileForm: {
        name: '',
        description: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    console.dir(nextProps);
  }

  componentDidUpdate(prevProps) {
    let prevRoute = '';
    let curRoute = '';

    try {
      prevRoute = prevProps.router.location.pathname;
      curRoute = this.props.router.location.pathname;
    } catch (e) {
      // pass
    }

    try {
      curRoute = this.props.router.location.pathname;
    } catch (e) {
      // pass
    }    

    // todo: abstract this so it can be applied to all login required routes
    if (
      curRoute === '/profile' &&
      prevRoute !== curRoute &&
      !this.props.user.loggedIn &&
      // ensure the login modal isn't already open and on top
      !(
        this.props.modals.openModals.length &&
        this.props.modals.openModals.find(modal => modal.type === 'Login') ===
        this.props.modals.openModals[this.props.modals.openModals.length - 1]
      )
    ) {
      this.props.actions.modalActions.openModal('Login');
    }
  }

  render() {
    const pathname = this.props.router.location && this.props.router.location.pathname;

    return (
      <div className="App">
        <ConnectedRouter history={history}>
          <div>
            <header className="App-header">
              <div className="App-logoWrap">
                <img src={pickle} className="App-logo" alt="logo" />
              </div>
              <h1 className="App-title">Local ⇆ Cloud Syncing Feel Good Funk</h1>
              <sub>Can you handle it?</sub>
              <div className="App-navWrap">
                <nav className="App-mainNav">
                  <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
                  <Link to="/profile" className={pathname === '/profile' ? 'active' : ''}>Profile</Link>
                </nav>
                <LoginMenu />
              </div>
            </header>
            <div className="App-mainContent">
              <div>
                <Route exact path="/" component={Home} />
                <Route path="/profile" component={Profile} />
              </div>
              <div className="App-modalContainer">
                {
                  this.props.modals.openModals
                    .map(modal => <ModalRoot key={modal.type} type={modal.type} id={modal.id} {...modal.props} />)
                }
              </div>
            </div>
          </div>
        </ConnectedRouter>
      </div>
    );
  }
}

function mapStateToProps(state, prop) {
  return {
    router: state.router,
    modals: state.modals,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      modalActions: bindActionCreators(ModalActions, dispatch),
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);