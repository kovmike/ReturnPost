import React from "react";
import Barcode from "react-barcode";
import classes from "./HeaderF23.module.css";
import { Label } from "../../../../../ui";

export const HeaderF23 = ({ barcode }) => {
  return (
    <div className={classes.wrapper}>
      <Barcode value={barcode} height="70" width="2" format="ITF" />
      <Label text="ф-23" />
    </div>
  );
};
