import React from "react";

export const Input = ({ title, handler, value }) => {
  return (
    <input onChange={handler} value={value}>
      {title}
    </input>
  );
};
