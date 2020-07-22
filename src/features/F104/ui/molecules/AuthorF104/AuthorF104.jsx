import React from "react";
import classes from "./AuthorF104.module.css";

export const AuthorF104 = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.names}>
        <div className={classes.line}>
          <label className={classes.who}>Составил:&nbsp;</label>
          <div className={classes.withDescription}>
            <div className={classes.divUnderlined}>Админ Админ</div>
            <div className={classes.description}>(должность, подпись работника ОПС, ФИО)</div>
          </div>
        </div>
        <div className={classes.line}>
          <label className={classes.who}>Проверил:&nbsp;</label>
          <div className={classes.withDescription}>
            <div className={classes.divUnderlined}></div>
            <div className={classes.description}>(должность, подпись ответственного лица ОПС, ФИО)</div>
          </div>
        </div>
        <div className={classes.line}>
          <label className={classes.who}>Принял:&nbsp;</label>
          <div className={classes.withDescription}>
            <div className={classes.divUnderlined}></div>
            <div className={classes.description}>(должность, подпись работника ОПС, ФИО)</div>
          </div>
        </div>
      </div>
      <div className={classes.stamp}>
        <div className={classes.blankStamp}></div>

        <div className={classes.stampDescription}>(Оттиск КПШ места вручения)</div>
      </div>
    </div>
  );
};
