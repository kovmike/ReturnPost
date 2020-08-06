import React from "react";

export const LineInfoF104 = ({ classes, labelText, objectName, name }) => {
  return (
    <div className={classes.line}>
      <label className={classes.bold}>{labelText}</label>
      <div className={classes.withDescription}>
        <div className={classes.divUnderlined}>{name}</div>
        <div className={classes.description}>{`(${objectName})`}</div>
      </div>
    </div>
  );
};
