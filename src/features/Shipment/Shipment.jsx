import React from "react";
import { createStore } from "effector";
import { useStore } from "effector-react";

const dummy = createStore("Shipment");

const Shipment = () => {
  const d = useStore(dummy);
  return <h1>{d + " - Shipment"}</h1>;
};

export { Shipment };
