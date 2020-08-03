import React from "react";
import { LineAuthorF104 } from "../../molecules/LineAuthorF104";
import classes from "./AuthorF104.module.css";

export const AuthorF104 = ({ name }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.names}>
        <LineAuthorF104 classes={classes} action={"Составил: "} name={name} desc={"(должность, подпись работника ОПС, ФИО)"} />
        <LineAuthorF104 classes={classes} action={"Проверил:"} name={" "} desc={"(должность, подпись ответственного лица ОПС, ФИО)"} />
        <LineAuthorF104 classes={classes} action={"Принял: "} name={" "} desc={"(должность, подпись работника ОПС, ФИО)"} />
      </div>
      <div className={classes.stamp}>
        <div className={classes.blankStamp}></div>
        <div className={classes.stampDescription}>(Оттиск КПШ места вручения)</div>
      </div>
    </div>
  );
};
