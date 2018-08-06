import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Bip39 from 'bip39';
// todo: itemize these
import * as UserActions from 'actions/user';
import { validatePassphrase } from 'actions/user';
// todo: itemize these
import * as ModalActions from 'actions/modals';
import ErrorList from 'components/ErrorList';
import EncryptOptOutConfirm from './EncryptOptOutConfirm';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 'login',
      loginForm: {
        seed: '',
        loginType:
          props.lsLogin &&
          props.lsLogin.lastLoginType === 'seed' &&
          props.lsLogin.logins.length
            ? 'password'
            : 'seed',
        password: ''
      },
      registerForm: {
        registerPassword: '',
        registerPasswordConfirm: ''
      },
      registerSeed: Bip39.generateMnemonic(),
      registerShowUnconfirmedOptOut: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user.loggedIn && this.props.user.loggedIn) {
      this.props.actions.modals.closeModal({ modalId: this.props.modalId });
    } else if (
      this.props.user.loginError &&
      prevProps.user.loginError !== this.props.user.loginError
    ) {
      this.props.actions.modals.openModal({
        modalType: 'SimpleMessage',
        title: 'There was an error logging in',
        body: this.props.user.loginError || ''
      });
    } else if (
      this.props.user.registerError &&
      prevProps.user.registerError !== this.props.user.registerError
    ) {
      this.props.actions.modals.openModal({
        modalType: 'SimpleMessage',
        title: 'There was an error registering',
        body: this.props.user.registerError || ''
      });
    }
  }

  handleInputChange = (event, nameSpace = '') => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let newState = {};

    event.persist();

    if (nameSpace) {
      newState = {
        [nameSpace]: {
          ...this.state[nameSpace],
          [name]: value
        }
      };
    } else {
      newState = {
        [name]: value
      };
    }

    this.setState(newState);
  };

  handleLoginFormInputChange = event => {
    return this.handleInputChange(event, 'loginForm');
  };

  handleRegisterFormInputChange = event => {
    return this.handleInputChange(event, 'registerForm');
  };

  validateLoginForm(data = this.state.loginForm) {
    const errors = {};

    if (data.loginType === 'seed') {
      // todo: ensure no numbers, no international characters.
      // only lowercase letters and spaces
      if (typeof data.seed !== 'string' || !data.seed) {
        errors.seed = errors.seed || [];
        errors.seed.push('You must satisfy my need for seed.');
      } else if (data.seed.split(' ').length !== 12) {
        errors.seed = errors.seed || [];
        errors.seed.push(
          'Your seed should consist of 12 words seperated by spaces.'
        );
      }
    } else {
      if (typeof data.password !== 'string' || !data.password) {
        errors.password = errors.password || [];
        errors.password.push('Please provide a password.');
      }

      if (
        typeof this.state.loginForm.account !== 'string' ||
        !this.state.loginForm.account
      ) {
        errors.account = errors.account || [];
        errors.account.push(
          'The account must be provided as a non-empty string.'
        );
      }
    }

    return Object.keys(errors).length ? errors : null;
  }

  handleLoginClick = e => {
    const loginFormErrors = this.validateLoginForm();

    if (loginFormErrors) {
      this.setState({ loginFormErrors });
    } else {
      this.setState({ loginFormErrors: [] });

      if (this.state.loginForm.loginType === 'seed') {
        this.props.actions.user.login(this.state.loginForm.seed);
      } else {
        let encryptedSeed;

        try {
          encryptedSeed = this.props.user.encryptedLogins[
            this.state.loginForm.account
          ].seed;
        } catch (e) {
          throw new Error(
            `There is no encrypted seed available for ${
              this.state.loginForm.account
            }`
          );
        }

        this.props.actions.user.loginViaPassword(
          encryptedSeed,
          this.state.loginForm.password
        );
      }
    }

    e.preventDefault();
  };

  handleRegisterClick = e => {
    this.setState({ phase: 'register' });
    e.preventDefault();
  };

  // todo: make these into constants
  get phases() {
    return ['login', 'register', 'registerEncryptSeed'];
  }

  handleRegisterNextClick = e => {
    const phases = this.phases;
    this.setState({
      phase: phases[phases.indexOf(this.state.phase) + 1]
    });
    e.preventDefault();
  };

  handleRegisterBackClick = e => {
    const phases = this.phases;
    this.setState({
      phase: phases[phases.indexOf(this.state.phase) - 1]
    });
    e.preventDefault();
  };

  validateRegisterForm(data = this.state.registerForm) {
    const errors = {};

    if (data.registerPassword !== data.registerPasswordConfirm) {
      errors.registerPassword = errors.registerPassword || [];
      errors.registerPassword.push('The provided passwords do not match.');
    }

    if (data.registerPassword) {
      const passphraseErrs = validatePassphrase(data.registerPassword);

      if (passphraseErrs) {
        errors.registerPassword = passphraseErrs;
      }
    }

    return Object.keys(errors).length ? errors : null;
  }

  handleRegisterSubmitClick = e => {
    const registerFormErrors = this.validateRegisterForm();

    if (registerFormErrors) {
      this.setState({ registerFormErrors });
    } else {
      this.setState({
        registerFormErrors: [],
        registerShowUnconfirmedOptOut: !this.state.registerForm.registerPassword
      });

      if (this.state.registerForm.registerPassword) {
        this.props.actions.user.register(
          this.state.registerSeed,
          this.state.registerForm.registerPassword
        );
      }
    }

    e.preventDefault();
  };

  handleConfirmOptOutOutsideClick = e => {
    this.setState({ registerShowUnconfirmedOptOut: false });
    e.preventDefault();
  };

  handleConfirmOptOutYesClick = e => {
    this.setState({ registerShowUnconfirmedOptOut: false });
    this.props.actions.user.register(
      this.state.registerSeed,
      this.state.registerForm.registerPassword
    );
    e.preventDefault();
  };

  handleConfirmOptOutNoClick = e => {
    this.setState({ registerShowUnconfirmedOptOut: false });
    e.preventDefault();
  };

  render() {
    let loginSubContent = (
      <div>
        <label htmlFor="loginSeed">Enter seed:</label>
        {this.state.loginFormErrors && this.state.loginFormErrors.seed ? (
          <ErrorList errors={this.state.loginFormErrors.seed} />
        ) : null}
        <textarea
          type="text"
          id="loginSeed"
          value={this.state.loginForm.seed}
          onChange={this.handleLoginFormInputChange}
          style={{ minHeight: '100px' }}
          placeholder="Feed my need for seed"
          name="seed"
        />
      </div>
    );

    const encryptedLoginsPresent =
      typeof this.props.user.encryptedLogins === 'object' &&
      Object.keys(this.props.user.encryptedLogins).length;

    if (
      this.state.loginForm.loginType === 'password' &&
      encryptedLoginsPresent
    ) {
      const encryptedLogins = this.props.user.encryptedLogins;
      const loginAccounts = Object.keys(encryptedLogins || {}).map(
        (peerId, index) => {
          const login = encryptedLogins[peerId];

          // if ((!this.state.loginForm.account &&
          //   peerId === this.props.user.lastLoginPeerId) || index === 0) {
          //   this.state.loginForm.account = peerId;
          // }

          return (
            <option value={peerId} key={peerId}>
              {login.name}
            </option>
          );
        }
      );

      loginSubContent = (
        <div>
          <div className="row">
            <label htmlFor="loginAccount">Select account:</label>
            {this.state.loginFormErrors &&
            this.state.loginFormErrors.account ? (
              <ErrorList errors={this.state.loginFormErrors.account} />
            ) : null}
            <select
              id="loginAccount"
              name="account"
              value={this.state.loginForm.account}
              onChange={this.handleLoginFormInputChange}
            >
              {loginAccounts}
            </select>
          </div>
          <div className="row">
            <label htmlFor="loginPassword">Enter passphrase:</label>
            {this.state.loginFormErrors &&
            this.state.loginFormErrors.password ? (
              <ErrorList errors={this.state.loginFormErrors.password} />
            ) : null}
            <input
              type="password"
              onChange={this.handleLoginFormInputChange}
              id="loginPassword"
              name="password"
              value={this.state.loginForm.password}
            />
          </div>
        </div>
      );
    }

    let content = (
      <div>
        <h1>Login</h1>
        <form>
          <div className="row">
            <div className="rowSm label">Login via:</div>
            {this.state.loginFormErrors &&
            this.state.loginFormErrors.loginType ? (
              <ErrorList errors={this.state.loginFormErrors.loginType} />
            ) : null}
            <div className="flexRow gutterH">
              <div>
                <label htmlFor="loginTypeSeed">
                  <input
                    type="radio"
                    name="loginType"
                    value="seed"
                    id="loginTypeSeed"
                    onChange={this.handleLoginFormInputChange}
                    checked={
                      this.state.loginForm.loginType === 'seed' ||
                      !encryptedLoginsPresent
                    }
                  />
                  {'\u00A0'}
                  seed
                </label>
              </div>
              <div>
                <label
                  htmlFor="loginTypePassword"
                  className={!encryptedLoginsPresent ? 'disabled' : ''}
                >
                  <input
                    type="radio"
                    name="loginType"
                    value="password"
                    id="loginTypePassword"
                    onChange={this.handleLoginFormInputChange}
                    checked={
                      this.state.loginForm.loginType === 'password' &&
                      encryptedLoginsPresent
                    }
                  />
                  {'\u00A0'}
                  password
                </label>
              </div>
            </div>
            {loginSubContent}
          </div>
          <p>
            Don't have an account? You can{' '}
            <a onClick={this.handleRegisterClick}>register</a> here.
          </p>
          <div className="flexRow gutterH">
            <button onClick={this.handleLoginClick}>Login</button>
          </div>
        </form>
      </div>
    );

    if (this.state.phase.startsWith('register')) {
      let registerSubContent = (
        <div>
          <div className="Login-seedWrap row">{this.state.registerSeed}</div>
          <ul>
            <li>Do not lose your seed.</li>
            <li>Write down your seed and store it in a safe place.</li>
            <li>Seed best practice blah to the blah.</li>
            <li>Seed best practice blah to the blah.</li>
          </ul>
          <div className="flexVCent flexRow gutterH">
            <button onClick={this.handleRegisterBackClick}>Back</button>
            <button onClick={this.handleRegisterNextClick}>Next</button>
          </div>
        </div>
      );

      if (this.state.phase === 'registerEncryptSeed') {
        let encryptOptOutConfirmBox;

        if (this.state.registerShowUnconfirmedOptOut) {
          encryptOptOutConfirmBox = (
            <EncryptOptOutConfirm
              onClickYes={this.handleConfirmOptOutYesClick}
              onClickNo={this.handleConfirmOptOutNoClick}
              onOutsideClick={this.handleConfirmOptOutOutsideClick}
            />
          );
        }

        registerSubContent = (
          <div>
            <p className="txB">
              It is strongly encouraged that you encrypt your seed on this
              device. This will allow you to login with an easier to remember
              password of your choosing instead of having to continuously expose
              your seed.
            </p>
            <form>
              <div className="row">
                <label htmlFor="registerPassword">Enter password:</label>
                {this.state.registerFormErrors &&
                this.state.registerFormErrors.registerPassword ? (
                  <ErrorList
                    errors={this.state.registerFormErrors.registerPassword}
                  />
                ) : null}
                <input
                  type="password"
                  onChange={this.handleRegisterFormInputChange}
                  name="registerPassword"
                  id="registerPassword"
                  placeholder="Please enter an encryption password"
                  value={this.state.registerForm.registerPassword}
                />
              </div>
              <div className="row">
                <label htmlFor="registerPasswordConfirm">
                  Confirm password:
                </label>
                {this.state.registerFormErrors &&
                this.state.registerFormErrors.registerPasswordConfirm ? (
                  <ErrorList
                    errors={
                      this.state.registerFormErrors.registerPasswordConfirm
                    }
                  />
                ) : null}
                <input
                  type="password"
                  onChange={this.handleRegisterFormInputChange}
                  name="registerPasswordConfirm"
                  id="registerPasswordConfirm"
                  placeholder="Please confirm the password"
                  value={this.state.registerForm.registerPasswordConfirm}
                />
              </div>
              <div className="flexVCent flexRow gutterH">
                <button onClick={this.handleRegisterBackClick}>Back</button>
                <div className="posR">
                  {encryptOptOutConfirmBox}
                  <button onClick={this.handleRegisterSubmitClick}>
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      }

      content = (
        <div>
          <h1>Register New Account</h1>
          {registerSubContent}
        </div>
      );
    }

    return <div className="Login">{content}</div>;
  }
}

function mapStateToProps(state, prop) {
  return {
    modals: state.modals,
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
)(Login);
