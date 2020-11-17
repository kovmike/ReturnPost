import React from "react";

export const LineDiff104 = ({ classes, set, text }) => {
  return (
    <div className={classes.line}>
      <div className={classes.count}>{set.count}</div>
      <div className={classes.classRPO}>{text}</div>
      <div className={classes.sum}>{Math.round(set.sum * 100) / 100}</div>
      <div className={classes.currency}>рублей(без НДС)</div>
    </div>
  );
};
//бандеролей, пересылаемых АВИА способом, на сумму
