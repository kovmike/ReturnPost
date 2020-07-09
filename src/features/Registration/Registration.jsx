import React, { useState } from "react";
import { useStore } from "effector-react";
import { $packageList } from "../../model/model.js";
import classes from "./Registration.module.css";
import { fetchFromTrackingFx, enteringBarcode } from "./../../model/model";

export const Registration = () => {
  const packageList = useStore($packageList);
  const [barcode, setBarcode] = useState(null);

  const click = () => {
    const data = barcode ? { payload: `${barcode}` } : { payload: "17095247999439" };

    enteringBarcode(data.payload);
    fetchFromTrackingFx(data);
  };

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };
  const prepareList = () => {
    if (Object.keys(packageList).length !== 0) {
      return Object.keys(packageList).map((pack, index) => (
        <tr key={`package${index}`}>
          <td className={classes.tableCell}>{pack}</td>
          <td className={classes.tableCell}>{packageList[pack].name}</td>
          <td className={classes.tableCell}>{packageList[pack].paynds}</td>
        </tr>
      ));
    }
    return null;
  };
  return (
    <div>
      <input type="text" onChange={onChangeInput}></input>
      <button onClick={click}>click</button>
      <table className={classes.listOfPackages}>{prepareList()}</table>
    </div>
  );
};
