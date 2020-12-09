import React, { useEffect, useRef } from "react";
import { useStore } from "effector-react";
import { $loggedUser } from "./../Auth";
import {
  showComponentDialog,
  $selectedAbonBox,
  $packageList,
  resetPackageList,
  $stamp,
  $container,
  $f104Barcode,
  waybillAdded,
} from "./../Registration/model.js";
import { HeaderF104, InfoF104, InfoContainerF104, TableF104, DiffF104, PackagesF104, AuthorF104 } from "./ui";
//import { $f104Barcode, waybillAdded } from "./model";

import classes from "./F104.module.css";

const F104 = () => {
  const selectedAbonBox = useStore($selectedAbonBox);
  const packageList = useStore($packageList);
  const loggedUser = useStore($loggedUser);
  const f014Barcode = useStore($f104Barcode);
  const container = useStore($container);
  const stamp = useStore($stamp);

  const dialogRef = useRef(null);
  useEffect(() => {
    if (dialogRef.current) dialogRef.current.showModal();
  }, [dialogRef]);

  const sumForPackages = (list) => {
    let obj = { packagesPay: 0, packagesNds: 0, parselPay: 0, parselNds: 0 };
    for (let key in list) {
      if (list[key].typ === 3) {
        obj.parselPay += list[key].pay;
        obj.parselNds += list[key].nds;
      } else {
        obj.packagesPay += list[key].pay;
        obj.packagesNds += list[key].nds;
      }
    }
    return obj;
  };

  return (
    <dialog ref={dialogRef} className={classes.dialogForm}>
      <div className={classes.wrapper}>
        <HeaderF104 waybillBarcode={f014Barcode} />
        <InfoF104 barcode={f014Barcode} abonBox={selectedAbonBox[0].abonentbox + " " + selectedAbonBox[0].firmname} />
        <InfoContainerF104 container={container} stamp={stamp} />
        <TableF104 packageList={packageList} />
        <DiffF104 packageList={packageList} />
        <PackagesF104
          type={"бандеролей"}
          sumWithOutNds={Math.round(sumForPackages(packageList).parselPay * 100) / 100}
          nds={sumForPackages(packageList).parselNds}
        />
        <PackagesF104
          type={"посылок"}
          sumWithOutNds={Math.round(sumForPackages(packageList).packagesPay * 100) / 100} //чтобы избежать кривых операций сложения типа 0.1+0.2 = 0.30000000000000000000000000004
          nds={Math.round(sumForPackages(packageList).packagesNds * 100) / 100}
        />
        <AuthorF104 name={loggedUser.userName} />
      </div>
      <button className={classes.closeBtn} onClick={() => showComponentDialog()}>
        {"❌"}
      </button>
      <button
        className={classes.closeBtn}
        onClick={() => {
          window.print();
          waybillAdded();
          resetPackageList();
        }}
      >
        {"Типа печать тут будет"}
      </button>
    </dialog>
  );
};

export { F104 };
