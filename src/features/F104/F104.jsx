import React, { useEffect, useRef } from "react";
import { useStore } from "effector-react";
import { $loggedUser } from "./../Auth";
import { showComponentDialog, $selectedAbonBox, $packageList, resetPackageList } from "./../Registration";
import { HeaderF104, InfoF104, InfoContainerF104, TableF104, DiffF104, PackagesF104, AuthorF104 } from "./ui";

import classes from "./F104.module.css";

const F104 = () => {
  const selectedAbonBox = useStore($selectedAbonBox);
  const packageList = useStore($packageList);
  const loggedUser = useStore($loggedUser);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (dialogRef.current) dialogRef.current.showModal();
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef} className={classes.dialogForm}>
      <div className={classes.wrapper}>
        <HeaderF104 waybillBarcode="1234567890128" />
        <InfoF104 abonBox={selectedAbonBox[0].abonentbox + " " + selectedAbonBox[0].firmname} />
        <InfoContainerF104 />
        <TableF104 packageList={packageList} />
        <DiffF104 packageList={packageList} />
        <PackagesF104 type={"бандеролей"} packageList={packageList} />
        <PackagesF104 type={"посылок"} packageList={packageList} />
        <AuthorF104 name={loggedUser} />
      </div>
      <button className={classes.closeBtn} onClick={() => showComponentDialog()}>
        {"❌"}
      </button>
      <button className={classes.closeBtn} onClick={() => resetPackageList()}>
        {"Типа печать тут будет"}
      </button>
    </dialog>
  );
};

export { F104 };
