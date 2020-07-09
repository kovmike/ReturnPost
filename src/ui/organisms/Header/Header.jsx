import React from "react";
import logo from "./../../common/logo.svg";
import classes from "./Header.module.css";

export const Header = () => {
  return (
    <div className={classes.headerWrapper}>
      <img src={logo} alt="logo" />
      <div>ВОЗВРАТ!!!!</div>
      <label>Autorized user</label>
    </div>
  );
};
