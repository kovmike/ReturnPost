import React, { useEffect, useRef } from "react";

import { showComponentDialog } from "./../Registration/Registration";
import { HeaderF104, InfoF104, InfoContainerF104, TableF104, DiffF104 } from "./ui";
import classes from "./F104.module.css";

const F104 = () => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (dialogRef.current) dialogRef.current.showModal();
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef}>
      <div className={classes.wrapper}>
        <HeaderF104 waybillBarcode="1234567890128" />
        <InfoF104 />
        <InfoContainerF104 />
        <TableF104 />
        <DiffF104 />
      </div>
      <button onClick={() => showComponentDialog()}>{"❌"}</button>
    </dialog>
  );
};

export { F104 };
