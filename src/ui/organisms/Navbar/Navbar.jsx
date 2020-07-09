import React from "react";
import classes from "./Navbar.module.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className={classes.wrapper}>
      <ul className={classes.menu}>
        <li>
          <Link className={classes.menuItem} to="/">
            Приписка
          </Link>
        </li>
        <li>
          <Link className={classes.menuItem} to="/waybills">
            Накладные
          </Link>
        </li>
        <li>
          <Link className={classes.menuItem} to="/shipment">
            Отгрузка
          </Link>
        </li>
        <li>
          <Link className={classes.menuItem} to="/reports">
            Отчеты
          </Link>
        </li>
      </ul>
    </div>
  );
};
