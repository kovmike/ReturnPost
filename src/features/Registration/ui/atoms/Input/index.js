import React from "react";

export const Input = ({ handler, onEnterPress, disabled, value }) => {
  const onEnter = (e) => {
    if (e.charCode === 13) onEnterPress();
  };
  return <input disabled={!disabled} value={value} onChange={handler} onKeyPress={onEnter}></input>;
};
