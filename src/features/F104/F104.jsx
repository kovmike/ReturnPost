import React, { useEffect, useRef } from "react";
import { HeaderF104, InfoF104, InfoContainerF104, TableF104, DiffF104, PackagesF104, AuthorF104 } from "./ui";
import classes from "./F104.module.css";

const F104 = ({
  selectedAbonBox,
  packageList,
  user,
  f104Barcode,
  container,
  stamp,
  defect,
  waybillAdded,
  showComponentDialog,
  resetPackageList,
}) => {
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
      <button className={classes.closeBtn} onClick={() => showComponentDialog()}>
        {"❌Закрыть"}
      </button>
      <button
        className={classes.closeBtn}
        onClick={() => {
          window.print();
          if (waybillAdded) waybillAdded();
          if (resetPackageList) resetPackageList();
          showComponentDialog();
        }}
      >
        {"Напечатать и закрыть"}
      </button>
      <div className={classes.wrapper}>
        <HeaderF104 waybillBarcode={f104Barcode} />
        <InfoF104
          barcode={f104Barcode}
          defect={defect}
          abonBox={selectedAbonBox[0].abonentbox + " " + selectedAbonBox[0].firmname}
        />
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
        <AuthorF104 name={user} />
      </div>
    </dialog>
  );
};

export { F104 };
