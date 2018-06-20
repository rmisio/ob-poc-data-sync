import React from 'react';
import PropTypes from 'prop-types';

const SimpleMessage = props => {
  return (
    <section>
      <h1>{props.title}</h1>
      <p>{props.body}</p>
    </section>
  );
};

SimpleMessage.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
}

export default SimpleMessage;