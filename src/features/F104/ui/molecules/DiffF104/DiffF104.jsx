import React from "react";

import classes from "./DiffF104.module.css";

export const DiffF104 = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.headSmallFont}>из них</div>
      <div className={classes.line}>
        <div className={classes.count}>0</div>
        <div className={classes.classRPO}>бандеролей, пересылаемых наземным способом, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.line}>
        <div className={classes.count}>0</div>
        <div className={classes.classRPO}>бандеролей, пересылаемых АВИА способом, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.avia}>
        <div className={classes.aviatariff}>в т.ч. авиатариф, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.line}>
        <div className={classes.count}>0</div>
        <div className={classes.classRPO}>посылок, пересылаемых наземным способом, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.line}>
        <div className={classes.count}>0</div>
        <div className={classes.classRPO}>посылок, пересылаемых АВИА способом, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.avia}>
        <div className={classes.aviatariff}>в т.ч. авиатариф, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.line}>
        <div className={classes.count}>0</div>
        <div className={classes.classRPO}>посылок он-лайн, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
      <div className={classes.line}>
        <div className={classes.count}>0</div>
        <div className={classes.classRPO}>курьер он-лайн, на сумму</div>
        <div className={classes.sum}>0</div>
        <div className={classes.currency}>рублей(без НДС)</div>
      </div>
    </div>
  );
};
