import React from "react";

export const LineInfoHeadF104 = ({ classes, labelText, data }) => {
  return (
    <div className={classes.line}>
      <label className={classes.bold}>{labelText}</label>
      <label className={classes.underlined}> {data} </label>
    </div>
  );
};
