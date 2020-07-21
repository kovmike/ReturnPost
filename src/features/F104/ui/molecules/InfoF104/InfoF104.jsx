import React from "react";
import classes from "./InfoF104.module.css";
// import { Label } from "../../../../../ui";

export const InfoF104 = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.line}>
        <label className={classes.bold}>СПИСОК №&nbsp;</label>
        <label className={classes.underlined}> &nbsp;&nbsp;1234567890128&nbsp;&nbsp; </label>
      </div>
      <div className={classes.line}>
        <label className={classes.bold}>возвращенных почтовых отправлений КАТЕГОРИЯ:&nbsp;</label>
        <label className={classes.underlined}> &nbsp;&nbsp;СТАНДАРТНЫЕ&nbsp;&nbsp; </label>
      </div>
      <div className={classes.line}>
        <label className={classes.bold}>От:&nbsp;</label>
        <label className={classes.underlined}> &nbsp;&nbsp;21.07.2020&nbsp;&nbsp; </label>
      </div>
      <div className={classes.line}>
        <label className={classes.bold}>Выданных в:&nbsp;</label>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>Тверской почтамт</div>
          <div className={classes.description}>(наименование объекта почтовой связи места вручения)</div>
        </div>
      </div>
      <div className={classes.line}>
        <label className={classes.bold}>Получатель :&nbsp;</label>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>ООО Всякхерываываываываываываыня</div>
          <div className={classes.description}>(наименование организации)</div>
        </div>
      </div>
      <div className={classes.line}>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}></div>
          <div className={classes.description}>(адрес)</div>
        </div>
      </div>
    </div>
  );
};
