import React from "react";
import classes from "./InfoContainerF104.module.css";

export const InfoContainerF104 = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.line}>
        <label>Почтовые отправления выданы в контейнере № </label>
        <label className={classes.number}>65465465464</label>
      </div>
      <div className={classes.line}>
        <label>Под пломбой </label>
        <label className={classes.number}>6546464</label>
      </div>
    </div>
  );
};
