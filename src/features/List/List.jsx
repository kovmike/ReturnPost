import React from "react";
import { useStore } from "effector-react";
import { $packageList } from "../../model/model.js";
import classes from "./List.module.css";

export const List = () => {
  const packageList = useStore($packageList);

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
  return <table className={classes.listOfPackages}>{prepareList()}</table>;
};
