import React from 'react';
import PropTypes from 'prop-types';
import OutsideClick from 'components/common/OutsideClick';

const EncryptOptOutConfirm = props => {
  return (
    <OutsideClick onOutsideClick={props.onOutsideClick}>
      <div className="Login-confirmEncryptOptOut contentBox confirmBox confirmBoxTop">
        <p>
          You have not provided an encryption password. Are you sure you
          want to register without encrypting your seed?
        </p>
        <div className="flexVCent gutterH">
          <button onClick={props.onClickYes}>Yes</button>
          <button onClick={props.onClickNo}>No</button>
        </div>
      </div>
    </OutsideClick>
  );
};

EncryptOptOutConfirm.propTypes = {
  onClickYes: PropTypes.func.isRequired,
  onClickNo: PropTypes.func.isRequired,
  onOutsideClick: PropTypes.func.isRequired,
}

export default EncryptOptOutConfirm;