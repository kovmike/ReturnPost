import React from "react";

export const Button = ({ title, handler, disabled }) => {
  return (
    <button disabled={!disabled} onClick={handler}>
      {title}
    </button>
  );
};
