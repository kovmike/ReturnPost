import React, { useState } from "react";
// import { using, spec, list, h } from "forest";
import { useStore } from "effector-react";
import { $fromTracking, fetchFromTrackingFx } from "./model/model";
import "./App.css";

export const App = () => {
  const [barcode, setBarcode] = useState("");
  const trackingData = useStore($fromTracking);

  const click = () => {
    const data = barcode ? { payload: `${barcode}` } : { payload: "17095247999439" };
    fetchFromTrackingFx(data);
    console.log(trackingData);
    // fetch("http://127.0.0.1:8000/", { method: "POST", body: JSON.stringify(data) })
    //   .then((r) => r.json())
    //   .then((data) => (labela.current.innerHTML = JSON.stringify(data)));
  };

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };
  // const clickDictionary = () => {
  //   fetch("https://tariff.pochta.ru/tariff//v1/dictionary?jsontext&category=all")
  //     .then((r) => r.json())
  //     .then((data) => (labela.current.innerHTML = JSON.stringify(data)));
  // };
  return (
    <div className="App">
      <input type="text" onChange={onChangeInput}></input>
      <button onClick={click}>click</button>
      {/* <button onClick={clickDictionary}>click</button> */}
      <label>{JSON.stringify(trackingData)}</label>
    </div>
  );
};
