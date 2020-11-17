import React from "react";
import cl from "./DivUnderLined.module.css";
const DivUnderLined = ({ text }) => {
  return <div className={cl.underlined}>{text}</div>;
};

export { DivUnderLined };
