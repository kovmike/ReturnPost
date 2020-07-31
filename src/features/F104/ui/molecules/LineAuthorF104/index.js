import React from "react";

export const LineAuthorF104 = ({ classes, action, name, desc }) => {
  return (
    <div className={classes.line}>
      <label className={classes.who}>{action}</label>
      <div className={classes.withDescription}>
        <div className={classes.divUnderlined}>{name}</div>
        <div className={classes.description}>{desc}</div>
      </div>
    </div>
  );
};
