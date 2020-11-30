import React, { useRef, useEffect } from "react";
import { HeaderF23, ContainersF23, FromTo, TableF23, Summary } from "./ui/molecules";
import { showF23Dialog, insertInToF23 } from "./../Shipment/model";
import classes from "./F23.module.css";

const F23 = ({ barcode, list }) => {
  const dialogF23Ref = useRef(null);
  useEffect(() => {
    if (dialogF23Ref.current) dialogF23Ref.current.showModal();
  }, [dialogF23Ref]);

  return (
    <dialog ref={dialogF23Ref} className={classes.dialogForm}>
      <div className={classes.wrapper}>
        <button
          onClick={() => {
            insertInToF23();
            showF23Dialog();
          }}
        >
          закрыть
        </button>
        <HeaderF23 barcode={barcode} />
        <ContainersF23 />
        <FromTo barcode={barcode} />
        <TableF23 list={list} />
        <Summary />
      </div>
    </dialog>
  );
};

export { F23 };
