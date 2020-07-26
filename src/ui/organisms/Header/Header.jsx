import React from "react";
import logo from "./../../common/logo.svg";
import classes from "./Header.module.css";

export const Header = ({ user }) => {
  return (
    <div className={classes.headerWrapper}>
      <img src={logo} alt="logo" />
      <div>ВОЗВРАТ!!!!</div>
      <label>{user}</label>
    </div>
  );
};
