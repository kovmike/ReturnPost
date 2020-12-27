import React from "react";
import { LineDiff104 } from "../../molecules/LineDiff104";
import { AviaLineDiff104 } from "../../molecules/AviaLineDiff104";
import classes from "./DiffF104.module.css";

export const DiffF104 = ({ packageList }) => {
  const TRANS_TYPE = {
    avia: -1,
    ground: 1,
  };

  const dividePackByClass = (packType, packTransName) => {
    const oneTypePackList = Object.keys(packageList).reduce((res, pack) => {
      //записываем в объект отправления вида packType

      if (packTransName) {
        return packageList[pack].typ === packType && packageList[pack].shipmentMethod === packTransName
          ? { ...res, [pack]: packageList[pack] }
          : res;
      } else {
        return packageList[pack].typ === packType ? { ...res, [pack]: packageList[pack] } : res;
      }
    }, {});
    //считаем общую сумму за этот вид отправлений
    const sum = Object.keys(oneTypePackList).reduce((acc, pack) => {
      return acc + oneTypePackList[pack].paynds;
    }, 0);

    return { count: Object.keys(oneTypePackList).length, sum };
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.headSmallFont}>из них</div>
      <LineDiff104
        classes={classes}
        set={dividePackByClass(3, TRANS_TYPE.ground)}
        text={"бандеролей, пересылаемых наземным способом, на сумму"}
      />
      <LineDiff104
        classes={classes}
        set={dividePackByClass(3, TRANS_TYPE.avia)}
        text={"бандеролей, пересылаемых АВИА способом, на сумму"}
      />
      <AviaLineDiff104 classes={classes} sum={0} />
      <LineDiff104
        classes={classes}
        set={{
          count: dividePackByClass(4, TRANS_TYPE.ground).count + dividePackByClass(47, TRANS_TYPE.ground).count,
          sum: dividePackByClass(4, TRANS_TYPE.ground).sum + dividePackByClass(47, TRANS_TYPE.ground).sum,
        }}
        text={"посылок, пересылаемых наземным способом, на сумму"}
      />
      <LineDiff104
        classes={classes}
        set={{
          count: dividePackByClass(4, TRANS_TYPE.avia).count + dividePackByClass(47, TRANS_TYPE.avia).count,
          sum: dividePackByClass(4, TRANS_TYPE.avia).sum + dividePackByClass(47, TRANS_TYPE.avia).sum,
        }}
        text={"посылок, пересылаемых АВИА способом, на сумму"}
      />
      <AviaLineDiff104 classes={classes} sum={0} />
      <LineDiff104 classes={classes} set={dividePackByClass(23)} text={"посылок он-лайн, на сумму"} />
      <LineDiff104 classes={classes} set={dividePackByClass(24)} text={"курьер он-лайн, на сумму"} />
    </div>
  );
};
