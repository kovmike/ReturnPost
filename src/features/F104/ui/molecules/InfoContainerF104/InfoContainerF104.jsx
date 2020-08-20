import React from "react";
import classes from "./InfoContainerF104.module.css";

export const InfoContainerF104 = ({ container, stamp }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.line}>
        <label>Почтовые отправления выданы в контейнере № </label>
        <label className={classes.number}>{container}</label>
      </div>
      <div className={classes.line}>
        <label>Под пломбой </label>
        <label className={classes.number}>{stamp}</label>
      </div>
    </div>
  );
};
