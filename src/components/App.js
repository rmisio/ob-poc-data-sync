import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { history } from 'index';
import * as ModalActions from 'actions/modals';
import { Route } from 'react-router'
import { Link } from 'react-router-dom';
import Home from 'components/Home';
import LoginMenu from 'components/LoginMenu';
// import Chat from './components/Chat';
import ModalRoot from 'components/modals/ModalRoot';
import pickle from 'images/pickle2.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    // props.actions.modalActions.openModal('Boom');
    console.dir(props);
  }

  handleLoginClick = () => {
    this.props.actions.modalActions.openModal('Login');
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
                  <Link to="/chat" className={pathname === '/chat' ? 'active' : ''}>Chat</Link>
                </nav>
                <LoginMenu />
              </div>
            </header>
            <div>
              <Route exact path="/" component={Home} />
              {/*<Route path="/chat" component={Chat} />*/}
            </div>
            <div className="App-modalContainer">
              {
                this.props.modals.openModals
                  .map(modal => <ModalRoot key={modal.type} type={modal.type} id={modal.id} {...modal.props} />)
              }
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