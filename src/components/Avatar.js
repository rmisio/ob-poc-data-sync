import React from 'react';
import './Avatar.css';

const Avatar = props => {
  const TagName = props.tagName || 'span';
  return (
    <TagName
      className="Avatar {props.className}"
      style={{backgroundImage: `url(${props.url})`}}>
    </TagName>
  );
}

export default Avatar;