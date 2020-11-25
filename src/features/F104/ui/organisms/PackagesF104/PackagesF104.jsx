import React from "react";
import classes from "./PackagesF104.module.css";
import { digToText } from "../../../../../common/common";

export const PackagesF104 = ({ type, sumWithOutNds, nds }) => {
  const rubAndKop = (count) => {
    const rub = ~~count;
    const kop =
      Math.round((count - ~~count) * 100) < 10
        ? `0${Math.round((count - ~~count) * 100)}`
        : Math.round((count - ~~count) * 100);
    return { rub, kop };
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.headSmallFont}>{`общая сумма платы за возврат ${type}`}</div>
      <div className={classes.line}>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>
            {`${sumWithOutNds} (${digToText(rubAndKop(sumWithOutNds).rub)} руб. ${~~rubAndKop(sumWithOutNds)
              .kop} коп.)`}
          </div>
          <div className={classes.description}>(сумма цифрами и прописью)</div>
        </div>
      </div>
      <div className={classes.line}>
        <label className={classes.bold}>НДС&nbsp;</label>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>{`${nds} (${digToText(rubAndKop(nds).rub)} руб. ${~~rubAndKop(nds)
            .kop} коп.)`}</div>
          <div className={classes.description}>(сумма цифрами и прописью)</div>
        </div>
      </div>
    </div>
  );
};
