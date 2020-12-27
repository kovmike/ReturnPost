import React, { useRef, useEffect } from "react";
import { HeaderF23, ContainersF23, FromTo, TableF23, Summary } from "./ui/molecules";
import classes from "./F23.module.css";

const F23 = ({ barcode, list, showComponentDialog, insertInToF23 }) => {
  const dialogF23Ref = useRef(null);
  useEffect(() => {
    if (dialogF23Ref.current) dialogF23Ref.current.showModal();
  }, [dialogF23Ref]);

  return (
    <dialog ref={dialogF23Ref} className={classes.dialogForm}>
      <div className={classes.wrapper}>
        <button
          onClick={() => {
            if (insertInToF23) insertInToF23();
            showComponentDialog();
          }}
        >
          закрыть
        </button>
        <HeaderF23 barcode={barcode} />
        <ContainersF23 />
        <FromTo barcode={barcode} />
        <TableF23 list={list} />
        <Summary
          totalCapacity={list.length}
          totalRpo={list.reduce((acc, waybill) => {
            return acc + waybill.count;
          }, 0)}
        />
      </div>
    </dialog>
  );
};

export { F23 };
