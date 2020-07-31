import React from "react";

export const Input = ({ handler, ...rest }) => {
  return <input value={rest.value} onChange={handler}></input>;
};
