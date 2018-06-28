import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'actions/user';
import * as ModalActions from 'actions/modals';
import LoginRequired from 'components/LoginRequired';
import ErrorList from 'components/ErrorList';
// import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 'view',
      form: {
        ...props.user.profile,
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.profile &&
      !prevProps.user.profile) {
      this.setState({
        form: {
          ...this.props.user.profile,
        }
      });
    }

    if (this.props.user.saveProfileError &&
      !prevProps.user.saveProfileError) {
      this.props.actions.modals.openModal('SimpleMessage', {
        title: 'There was an saving your profile',
        body: this.props.user.saveProfileError,
      });
    }

    if (this.props.user.savingProfileSaved &&
      !prevProps.user.savingProfileSaved) {
      this.setState({ phase: 'view' });
    }
  }  

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  }

  handleEditClick = e => {
    this.setState({ phase: 'edit'});
    e.preventDefault();
  }

  handleFormCancelClick = e => {
    this.setState({ phase: 'view'});
    e.preventDefault();
  }

  handleFormSubmitClick = e => {
    this.props.actions.user.saveProfile(this.state.form);
    e.preventDefault();
  }

  render() {
    const profile = this.props.user.profile;
    let content = (
      <div style={{textAlign: 'center'}}>
        <h2>Profile not set</h2>
        <p>You either entered the wrong seed when you logged in or your local browser does not have your data and the sync with the remote hasn't completed. Unless your internet is out, you probably entered the wrong seed.</p>
      </div>
    );

    if (!this.props.user.loggedIn) {
      content = <LoginRequired />;
    } else if (profile) {
      if (this.state.phase === 'view') {
        content = (
          <div>
            <div className="row">
              <div className="rowSm txB">Peer ID:</div>
              <div>{profile.peerID}</div>
            </div>
            <div className="row">
              <div className="rowSm txB">Name:</div>
              <div>{profile.name}</div>
            </div>
            <div className="row">
              <div className="rowSm txB">Description:</div>
              <div>{profile.description}</div>
            </div>
            <div className="row">
              <div className="rowSm txB">Avatar Url:</div>
              <div>{profile.avatarUrl}</div>
            </div>
            <hr />
            <div>
              <button onClick={this.handleEditClick}>Edit</button>
            </div>            
          </div>
        );
      } else {
        content = (
          <form>
            <div className="row">
              <label htmlFor="name">Name:</label>
              {
                this.state.formErrors && this.state.formErrors.name ?
                  <ErrorList errors={this.state.formErrors.name} /> : null
              }
              <input
                type="text"
                id="name"
                value={this.state.form.name}
                onChange={this.handleInputChange}
                placeholder="What yo name?"
                name="name"
                ></input>
            </div>
            <div className="row">
              <label htmlFor="description">Description:</label>
              {
                this.state.formErrors && this.state.formErrors.description ?
                  <ErrorList errors={this.state.formErrors.description} /> : null
              }
              <textarea
                type="text"
                id="description"
                value={this.state.form.description}
                onChange={this.handleInputChange}
                placeholder="Who be you?"
                name="description"
                style={{minHeight: '100px'}}
                ></textarea>
            </div>
            <div className="row">
              <label htmlFor="avatarUrl">Avatar Url:</label>
              {
                this.state.formErrors && this.state.formErrors.avatarUrl ?
                  <ErrorList errors={this.state.formErrors.avatarUrl} /> : null
              }
              <input
                type="text"
                id="avatarUrl"
                value={this.state.form.avatarUrl}
                onChange={this.handleInputChange}
                placeholder="Where yo facial at?"
                name="avatarUrl"
                ></input>
            </div>
            <div className="flexRow gutterH">
              <button onClick={this.handleFormCancelClick}>Cancel</button>
              <button onClick={this.handleFormSubmitClick}>Save</button>
            </div>
          </form>
        );
      }      
    }

    return (
      <div className="Profile">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
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


export default connect(mapStateToProps, mapDispatchToProps)(Profile);