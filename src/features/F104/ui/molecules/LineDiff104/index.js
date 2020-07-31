import React from "react";

export const LineDiff104 = ({ classes, count, sum, text }) => {
  return (
    <div className={classes.line}>
      <div className={classes.count}>{count}</div>
      <div className={classes.classRPO}>{text}</div>
      <div className={classes.sum}>{sum}</div>
      <div className={classes.currency}>рублей(без НДС)</div>
    </div>
  );
};
//бандеролей, пересылаемых АВИА способом, на сумму
