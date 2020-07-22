import React from "react";

import classes from "./PackagesF104.module.css";

export const PackagesF104 = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.headSmallFont}>общая сумма платы за возврат посылок</div>
      <div className={classes.line}>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>0(ноль) рублей</div>
          <div className={classes.description}>(сумма цифрами и прописью)</div>
        </div>
      </div>
      <div className={classes.line}>
        <label className={classes.bold}>НДС&nbsp;</label>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>0(ноль) рублей</div>
          <div className={classes.description}>(сумма цифрами и прописью)</div>
        </div>
      </div>
    </div>
  );
};
