import React, { useRef } from "react";
// import { using, spec, list, h } from "forest";
import "./App.css";

export const App = () => {
  const inpud = useRef(null);
  const labela = useRef(null);

  const click = () => {
    const data = inpud.current.value ? { payload: `${inpud.current.value}` } : { payload: "17095247999439" };

    fetch("http://127.0.0.1:8000/", { method: "POST", body: JSON.stringify(data) })
      .then((r) => r.json())
      .then((data) => (labela.current.innerHTML = JSON.stringify(data)));
  };

  const clickDictionary = () => {
    fetch("https://tariff.pochta.ru/tariff//v1/dictionary?jsontext&category=all")
      .then((r) => r.json())
      .then((data) => (labela.current.innerHTML = JSON.stringify(data)));
  };
  return (
    <div className="App">
      <input type="text" ref={inpud}></input>
      <button onClick={click}>click</button>
      <button onClick={clickDictionary}>click</button>
      <label ref={labela}>2314</label>
    </div>
  );
};
