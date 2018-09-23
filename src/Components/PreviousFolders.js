import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../todo.css';

export const PreviousFolders = (props) => {

  const { previous, pagerFunc, currentFolder, className } = props;
  let prev = [...previous];
  const home = (<img src={"home.png"} className="homeImg" />);

  if(prev.length > 0) {
    prev.shift();
    prev.unshift({id:0, name:home});
    prev.push({id:prev.length, name:(<b>{currentFolder}</b>)});
  } else {
    prev.push({id:0, name:home});
  }

  return (
      prev.map((value, index) =>
      <span key={index}> {"/"}
        <span
            className={`toDoPreviousPages ${className?className:""} ${(prev.length-1 === index)?'last':''}`}
            onClick={() => (prev.length-1 === index)?null:pagerFunc(index, value.id, value.name)}>
              {value.name}
        </span>
      </span>)
  )
}

PreviousFolders.propTypes = {
  previous: PropTypes.array,
  pagerFunc: PropTypes.func,
  currentFolder: PropTypes.string,
  className: PropTypes.string
}
