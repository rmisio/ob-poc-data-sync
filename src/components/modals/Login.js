import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as UserActions from 'actions/user';
import ErrorList from 'components/ErrorList';
// import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 'login',
      loginForm: {
        seed: '',
      },
    }
  }

  handleInputChange = (event, nameSpace = '') => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let newState = {};

    console.log(`the nameSpace is ${nameSpace}`);
    console.log('poo');
    event.persist();
    window.poo = event;
    console.log('poo - END');

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

  validateLoginForm(data = this.state.loginForm) {
    const errors = {};

    if (typeof data.seed !== 'string' || !data.seed) {
      errors.seed = errors.seed || [];
      errors.seed.push('You must satisfy my need for seed.');
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
        <div className="flexRow">
          <button onClick={this.handleLoginClick}>Login</button>
        </div>
      </form>
    );
    
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
    // modals: state.modals,
    // user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      user: bindActionCreators(UserActions, dispatch),
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);