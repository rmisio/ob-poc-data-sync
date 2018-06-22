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

import * as RxDB from 'rxdb';
import { QueryChangeDetector } from 'rxdb';
import profileSchema from 'schema/profile';

const syncURL = 'http://localhost:5984/';
const dbName = 'obdb';

QueryChangeDetector.enable();
QueryChangeDetector.enableDebugging();

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

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

  async createDatabase() {
    return;
    let db;

    // password must have at least 8 characters
    try {
      db = await RxDB.create(
        {
          name: dbName,
          adapter: 'idb',
          password: '123456789'
        }
      );
    } catch (err) {
      console.error('There was an error connecting to the db.');
      throw err;
    }

    // show who's the leader in page's title
    // db.waitForLeadership().then(() => {
    //   document.title = '♛ ' + document.title;
    // });

    // get profile
    const profileCollection = await db.collection({
      name: 'profiles',
      schema: profileSchema
    });

    // set up replication
    const replicationState = 
      profileCollection.sync({ remote: syncURL + dbName + '/' });
    this.subs.push(
      replicationState.change$.subscribe(change => {
        console.dir(change)
      })
    );
    this.subs.push(
      replicationState.docs$.subscribe(docData => console.dir(docData))
    );
    this.subs.push(
      replicationState.active$.subscribe(active => console.log(`Replication active: ${active}`))
    );
    this.subs.push(
      replicationState.complete$.subscribe(completed => console.log(`Replication completed: ${completed}`))
    );
    this.subs.push(
      replicationState.error$.subscribe(error => {
        console.dir(error)
      })
    );

    return db;
  }

  async componentDidMount() {
    // this.db = await this.createDatabase();

    // const sub = 
    //   this.db.profiles
    //     .findOne('555')
    //     .$.subscribe(profile => {
    //       if (!profile) return;
    //       this.setState({ profile });
    //     });
    // this.subs.push(sub);
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe());
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

  handleLoginClick = () => {
    this.props.actions.modalActions.openModal('Login');
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      profileForm: {
        ...this.state.profileForm,
        [name]: value,
      },
    });
  }

  handleSaveProfileClick = () => {
    this.setState({ savingProfile: true });
    this.saveProfile()
      .then()
      .catch()
      .then(() => {
        this.setState({ savingProfile: false });
      });
  }  

  async saveProfile() {
    await this.db.profiles.upsert({
      peerID: '555',
      name: this.state.profileForm.name,
      description: this.state.profileForm.description,
    })
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
              <div>{JSON.stringify(this.state.profile)}</div>
              <br />
              <br />
              <div>
                <input
                  type="text"
                  value={this.state.profileForm.name}
                  onChange={this.handleInputChange}
                  placeholder="What be yo name?"
                  name="name">
                </input>
              </div>
              <div>
                <textarea
                  value={this.state.profileForm.description}
                  onChange={this.handleInputChange}
                  name="description">
                </textarea>
              </div>
              <div>
                <button onClick={this.handleSaveProfileClick} disabled={this.state.savingProfile}>Save dat shit</button>
              </div>
              <br />
              <br />            
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