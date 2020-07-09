import React from "react";

export const Button = ({ title, handler }) => {
  return <button onClick={handler}>{title}</button>;
};
