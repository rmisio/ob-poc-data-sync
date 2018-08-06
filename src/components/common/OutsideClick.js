import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class OutsideClick extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocClick);
  }

  handleDocClick = event => {
    if (
      this.wrapperRef &&
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.onOutsideClick(event);
    }
  };

  render() {
    return <div ref={this.wrapperRef}>{this.props.children}</div>;
  }
}

OutsideClick.propTypes = {
  onOutsideClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
};
