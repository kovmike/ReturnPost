import { useStore } from "effector-react";
import React, { useEffect } from "react";
import { F23 } from "./../F23";
import {
  showF23Dialog,
  $f23DialogIsActive,
  getUnshippedWaybills,
  $unshippedWaybills,
  genBarcodef23,
  $f23barcode,
  addToF23,
  removeFromF23,
  $allowedF23,
  $listF23,
  insertInToF23,
} from "./model";

import { ShipmentTable } from "./ui/molecules/";

const Shipment = () => {
  const allowedF23 = useStore($allowedF23);
  const f23DialogIsActive = useStore($f23DialogIsActive);
  const unshippedWaybills = useStore($unshippedWaybills);
  const f23barcode = useStore($f23barcode);
  const listF23 = useStore($listF23);

  useEffect(() => {
    getUnshippedWaybills();
  }, []);

  const generateF23 = () => {
    genBarcodef23();
    showF23Dialog();
  };

  return (
    <div>
      <h3>Список неотгруженных ф104</h3>
      <ShipmentTable unshippedList={unshippedWaybills} addToF23={addToF23} removeFromF23={removeFromF23} />
      <button disabled={!allowedF23} onClick={() => generateF23()}>
        Сформировать ф23
      </button>
      {/* {allowedF23 ? null : <span> разные даты</span>} */}
      {f23DialogIsActive ? (
        <F23 barcode={f23barcode} list={listF23} showComponentDialog={showF23Dialog} insertInToF23={insertInToF23} />
      ) : null}
    </div>
  );
};

export { Shipment };
