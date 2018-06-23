import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'actions/user';
import * as ModalActions from 'actions/modals';
import { generateSeed } from 'util/crypto';
import ErrorList from 'components/ErrorList';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 'login',
      loginForm: {
        seed: '',
      },
      registerSeed: generateSeed(),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.loggedIn) {
      this.props.actions.modals.closeModal(this.props.id);
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
          [name]: value,
        },
      }
    } else {
      newState = {
        [name]: value,
      }
    }

    this.setState(newState);
  }

  handleLoginFormInputChange = event => {
    return this.handleInputChange(event, 'loginForm');
  }

  handleRegisterFormInputChange = event => {
    return this.handleInputChange(event, 'registerForm');
  }

  handleLoginClick = e => {
    const loginFormErrors =
      this.validateLoginForm();

    if (loginFormErrors) {
      this.setState({ loginFormErrors });
    } else {
      this.setState({ loginFormErrors: [] });
      this.props.actions.user.login(this.state.loginForm.seed);
    }

    e.preventDefault();
  }

  handleRegisterClick = e => {
    this.setState({ phase: 'register' });
    e.preventDefault();
  }

  handleCreateClick = e => {
    this.props.actions.user.login(this.state.registerSeed);
    e.preventDefault();
  }

  validateLoginForm(data = this.state.loginForm) {
    const errors = {};

    if (typeof data.seed !== 'string' || !data.seed) {
      errors.seed = errors.seed || [];
      errors.seed.push('You must satisfy my need for seed.');
    } else if (data.seed.length < 10) {
      errors.seed = errors.seed || [];
      errors.seed.push('Your seed must be at least 10 characters long.');
    }

    return Object.keys(errors).length ? errors : null;
  }

  render() {
    let content = (
      <form>
        <div className="row">
          <label htmlFor="loginSeed">Enter seed:</label>
          {
            this.state.loginFormErrors && this.state.loginFormErrors.seed ?
              <ErrorList errors={this.state.loginFormErrors.seed} /> : null
          }
          <textarea
            type="text"
            id="loginSeed"
            value={this.state.loginForm.seed}
            onChange={this.handleLoginFormInputChange}
            style={{minHeight: '100px'}}
            placeholder="I have a need for seed"
            name="seed"
            ></textarea>
        </div>
        <div className="flexRow gutterH">
          <button onClick={this.handleLoginClick}>Login</button>
          <button onClick={this.handleRegisterClick}>Register</button>
        </div>
      </form>
    );

    if (this.state.phase === 'register') {
      content = (
        <div>
          <div className="Login-seedWrap row">{this.state.registerSeed}</div>

          <div className="flexVCent flexRow gutterH">
            <button onClick={this.handleCreateClick}>Create</button>
            <div className="clrTEm">Don't forget your seed or you might be left in great need!</div>
          </div>          
        </div>
      );      
    }
    
    return (
      <div className="Login">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state, prop) {
  return {
    // router: state.router,
    modals: state.modals,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      user: bindActionCreators(UserActions, dispatch),
      modals: bindActionCreators(ModalActions, dispatch),
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);