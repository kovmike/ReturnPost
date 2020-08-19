import React from "react";
import Barcode from "react-barcode";
import classes from "./HeaderF104.module.css";
import { Label } from "../../../../../ui";

export const HeaderF104 = ({ waybillBarcode }) => {
  return (
    <div className={classes.wrapper}>
      <Barcode value={waybillBarcode} height="70" width="2" format="ITF" />
      <Label text="ф-104.в" />
    </div>
  );
};
