import React from "react";
import { LineDiff104 } from "../../molecules/LineDiff104";
import { AviaLineDiff104 } from "../../molecules/AviaLineDiff104";
import classes from "./DiffF104.module.css";

export const DiffF104 = ({ packageList }) => {
  const dividePackByClass = (packType, packTransName) => {
    let oneTypePackList = Object.keys(packageList).reduce((res, pack) => {
      return packageList[pack].typ === packType ? { ...res, pack: packageList[pack] } : res;
    }, {});

    return Object.keys(oneTypePackList).length;
  };
  console.log(packageList);
  return (
    <div className={classes.wrapper}>
      <div className={classes.headSmallFont}>из них</div>
      <LineDiff104 classes={classes} count={0} sum={0} text={"бандеролей, пересылаемых наземным способом, на сумму"} />
      <LineDiff104 classes={classes} count={0} sum={0} text={"бандеролей, пересылаемых АВИА способом, на сумму"} />
      <AviaLineDiff104 classes={classes} sum={0} />
      <LineDiff104 classes={classes} count={0} sum={0} text={"посылок, пересылаемых наземным способом, на сумм"} />
      <LineDiff104 classes={classes} count={0} sum={0} text={"посылок, пересылаемых АВИА способом, на сумму"} />
      <AviaLineDiff104 classes={classes} sum={0} />
      <LineDiff104 classes={classes} count={dividePackByClass(23, 0)} sum={0} text={"посылок он-лайн, на сумму"} />
      <LineDiff104 classes={classes} count={0} sum={0} text={"курьер он-лайн, на сумму"} />
    </div>
  );
};
