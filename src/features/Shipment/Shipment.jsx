import { useStore } from "effector-react";
import React, { useEffect } from "react";
//import { genBarcodef23 } from "./../F23/model.js";
import { F23 } from "./../F23";
import {
  showF23Dialog,
  $f23DialogIsActive,
  getUnshippedWaybills,
  $unshippedWaybills,
  genBarcodef23,
  $f23barcode,
} from "./model";
import { ShipmentTable } from "./ui/molecules/";

const Shipment = () => {
  const f23DialogIsActive = useStore($f23DialogIsActive);
  const unshippedWaybills = useStore($unshippedWaybills);
  const f23barcode = useStore($f23barcode);
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
      <ShipmentTable unshippedList={unshippedWaybills} />
      <button onClick={() => generateF23()}>Сформировать ф23</button>
      {f23DialogIsActive ? <F23 barcode={f23barcode} /> : null}
    </div>
  );
};

export { Shipment };
