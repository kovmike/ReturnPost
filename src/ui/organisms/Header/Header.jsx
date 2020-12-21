import React from "react";
import logo from "./../../common/logo.svg";
import classes from "./Header.module.css";
import { logOut } from "../../../features/Auth/model";
import { resetWayBillList } from "./../../../features/Waybills/model";

export const Header = ({ user }) => {
  const logout = () => {
    localStorage.clear();
    logOut();
    resetWayBillList();
  };

  return (
    <div className={classes.headerWrapper}>
      <img src={logo} alt="logo" />
      <div>Почтовый возврат</div>
      <div className={classes.userBlock}>
        <label className={classes.user}>{user}</label>
        {user !== "Ожидание авторизации" ? (
          <button className={classes.out} onClick={logout}>
            выйти
          </button>
        ) : null}
      </div>
    </div>
  );
};
