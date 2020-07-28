import React from "react";
import logo from "./../../common/logo.svg";
import classes from "./Header.module.css";
import { logOut } from "../../../features/Auth/model";

export const Header = ({ user }) => {
  const logout = () => {
    localStorage.clear();
    logOut();
  };

  return (
    <div className={classes.headerWrapper}>
      <img src={logo} alt="logo" />
      <div>ВОЗВРАТ!!!!</div>
      <label>{user}</label>
      {user !== "Ожидание авторизации" ? <button onClick={logout}>выйти</button> : null}
    </div>
  );
};
