import React, { useEffect, useRef } from "react";
import { useStore } from "effector-react";
import { $loggedUser } from "./../Auth";
import { showComponentDialog, $selectedAbonBox, $packageList, resetPackageList } from "./../Registration";
import { HeaderF104, InfoF104, InfoContainerF104, TableF104, DiffF104, PackagesF104, AuthorF104 } from "./ui";
import { $f104Barcode } from "./model";

import classes from "./F104.module.css";

const F104 = () => {
  const selectedAbonBox = useStore($selectedAbonBox);
  const packageList = useStore($packageList);
  const loggedUser = useStore($loggedUser);
  const f014Barcode = useStore($f104Barcode);
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
        <InfoF104 abonBox={selectedAbonBox[0].abonentbox + " " + selectedAbonBox[0].firmname} />
        <InfoContainerF104 />
        <TableF104 packageList={packageList} />
        <DiffF104 packageList={packageList} />
        <PackagesF104
          type={"бандеролей"}
          sumWithOutNds={sumForPackages(packageList).parselPay}
          nds={sumForPackages(packageList).parselNds}
        />
        <PackagesF104
          type={"посылок"}
          sumWithOutNds={sumForPackages(packageList).packagesPay}
          nds={sumForPackages(packageList).packagesNds}
        />
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
