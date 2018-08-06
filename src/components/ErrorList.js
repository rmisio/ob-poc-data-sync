import React from 'react';
import PropTypes from 'prop-types';
import './ErrorList.css';

const ErrorList = props => {
  let content = props.errors.map(error => (
    <li key="error.replace(/\s/g,'')">{error}</li>
  ));

  if (!props.errors.length) {
    content = null;
  }

  return <ul className="ErrorList">{content}</ul>;
};

ErrorList.propTypes = {
  errors: PropTypes.array.isRequired
};

export default ErrorList;
