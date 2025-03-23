import React from 'react';

const SwitchBtn = ({ checked, onChange, disabled }) => {
  const switchStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '30px',
    height: '18px'
  };

  const inputStyle = {
    opacity: 0,
    width: 0,
    height: 0
  };

  const sliderStyle = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: checked ? '#2196F3' : '#ccc',
    transition: '.4s',
    borderRadius: '9px'
  };

  const sliderBeforeStyle = {
    position: 'absolute',
    content: '',
    height: '14px',
    width: '14px',
    left: checked ? '16px' : '2px',
    bottom: '2px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%'
  };

  return (
    <label style={switchStyle}>
      <input  type="checkbox" style={inputStyle} checked={checked} onChange={onChange} disabled={disabled}/>
      <span style={sliderStyle}>
        <span style={sliderBeforeStyle}></span>
      </span>
    </label>
  );
};

export default SwitchBtn;
