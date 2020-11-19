import { useStore } from "effector-react";
import React, { useEffect } from "react";
import { F23 } from "./../F23";
import { showF23Dialog, $f23DialogIsActive, getUnshippedWaybills, $unshippedWaybills } from "./model";
import { ShipmentTable } from "./ui/molecules/";

const Shipment = () => {
  const f23DialogIsActive = useStore($f23DialogIsActive);
  const unshippedWaybills = useStore($unshippedWaybills);
  useEffect(() => {
    getUnshippedWaybills();
  }, []);

  return (
    <div>
      <h3>Список неотгруженных ф104</h3>
      <ShipmentTable unshippedList={unshippedWaybills} />
      <button onClick={() => showF23Dialog()}>Показать ф23</button>
      {f23DialogIsActive ? <F23 /> : null}
    </div>
  );
};

export { Shipment };
