import React from "react";
import Barcode from "react-barcode";
import classes from "./HeaderF23.module.css";
import { Label } from "../../../../../ui";

export const HeaderF23 = ({ waybillBarcode }) => {
  return (
    <div className={classes.wrapper}>
      <Barcode value={"1700005340000062"} height="70" width="2" format="ITF" />
      <Label text="ф-23" />
    </div>
  );
};
