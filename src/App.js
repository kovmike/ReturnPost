import React, { useState } from "react";
import { List } from "./features/List/List";
// import { using, spec, list, h } from "forest";

import { fetchFromTrackingFx, enteringBarcode } from "./model/model";
import "./App.css";

export const App = () => {
  const [barcode, setBarcode] = useState(null);

  const click = () => {
    const data = barcode ? { payload: `${barcode}` } : { payload: "17095247999439" };

    enteringBarcode(data.payload);
    fetchFromTrackingFx(data);
  };

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };

  return (
    <div className="App">
      <input type="text" onChange={onChangeInput}></input>
      <button onClick={click}>click</button>
      {/* <label>{barcode}</label> */}
      <List />
    </div>
  );
};
