import React from "react";
import { HeaderF23, ContainersF23 } from "./ui/molecules";
import classes from "./F23.module.css";

const F23 = () => {
  return (
    <div className={classes.wrapper}>
      {/* <span>&uarr;</span>
      <span>&darr;</span> */}
      <HeaderF23 />
      <ContainersF23 />
    </div>
  );
};

export { F23 };
