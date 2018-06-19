import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'actions/modals';
import './ModalRoot.css';

class ModalRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.processProps(props);
  }

  processProps(props = {}) {
    if (typeof props.type !== 'string') return;

    import(`./${props.type}`)
      .then(ModalModule => {
        if (this.state.ModalComponent) return;
        this.setState({ ModalComponent: ModalModule.default });
      })
      .catch(error => {
        console.error(error);
        /* Error handling */
      });
  }

  handleClick = event => {
    this.props.actions.closeModal(this.props.id);
  }

  render() {
    if (!this.state.ModalComponent) return null;

    const modalProps = { ...this.props };
    delete modalProps.type;

    return (
      <div className="ModalRoot">
        <div className="ModalRoot-innerWrap">
          <a className="ModalRoot-close" onClick={this.handleClick}>X</a>
          <this.state.ModalComponent {...modalProps} />
        </div>
      </div>
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