import React from 'react';
import './Avatar.css';
import defaultAvatar from 'images/default-avatar-250x250.png';

const Avatar = props => {
  const TagName = props.tagName || 'span';
  return (
    <TagName
      className="Avatar {props.className}"
      style={{ backgroundImage: `url(${props.url}), url(${defaultAvatar})` }}
    />
  );
};

export default Avatar;
