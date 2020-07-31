import React from "react";

export const AviaLineDiff104 = ({ classes, sum }) => {
  return (
    <div className={classes.avia}>
      <div className={classes.aviatariff}>в т.ч. авиатариф, на сумму</div>
      <div className={classes.sum}>{sum}</div>
      <div className={classes.currency}>рублей(без НДС)</div>
    </div>
  );
};
