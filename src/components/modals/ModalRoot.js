import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'actions/modals';
import { singletonModals } from 'reducers/modals';
import './ModalRoot.css';

// todo: export modal constants from their respective component.

class ModalRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.processProps(props);
  }

  processProps(props = {}) {
    // todo: if a certain modal type is imported above, use that instead of
    // deferred loading.
    // todo: launch loading modal during deffered loading or make a fancy pants in
    // modal loading animation?
    // todo: show error state if deferred loading error, with retry (?)
    import(`./${props.modalType}`)
      .then(
        ModalModule => {
          if (this.state.ModalComponent) return;
          this.setState({ ModalComponent: ModalModule.default });
        },
        error => {
          console.error(error);
        },
      );
  }

  handleClick = event => {
    this.props.actions.closeModal(this.props.modalType, this.props.modalId);
  }

  render() {
    if (!this.state.ModalComponent) return null;

    const modalProps = { ...this.props };
    delete modalProps.type;

    return (
      <section className="ModalRoot">
        <div className="ModalRoot-innerWrap">
          <a className="ModalRoot-close" onClick={this.handleClick}>X</a>
          <this.state.ModalComponent {...modalProps} />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state, props) {
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ModalActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);