import React from 'react';
import './Loader.css';

const Loader = ({ inline = false }) => {
  return (
    <div className={`loader-wrapper${inline ? ' loader-wrapper--inline' : ''}`}>
      <div className="loader" />
    </div>
  );
};

export default Loader;
