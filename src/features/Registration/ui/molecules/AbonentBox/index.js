import React, { createRef } from "react";
import { Label, Button } from "./../../index";

export const AbonentBox = ({ abonBoxNumber, firmName, abonBoxList, pickAbonBox, addToClearButton }) => {
  const abonBoxRef = createRef();
  const clearABInput = () => {
    abonBoxRef.current.value = "";
    addToClearButton();
  };

  const prepareList = (list) => {
    return list.map((abonBox) => {
      return <option value={abonBox.abonentbox + " : " + abonBox.firmname}>{"ID: " + abonBox.id}</option>;
    });
  };
  const valueOfIntup = (number, name) => {
    if (number && name) return number + " : " + name;
    return "";
  };

  return (
    <div>
      <Label text={abonBoxNumber ? "Выбран: " : "Выберите А/Я: "} />
      <input
        ref={abonBoxRef}
        list="dataListId"
        onChange={pickAbonBox}
        value={valueOfIntup(abonBoxNumber, firmName)}
      ></input>
      <datalist id="dataListId">{prepareList(abonBoxList)}</datalist>
      <Button disabled={true} handler={clearABInput} title="Очистить" />
    </div>
  );
};
//abonBoxNumber + " : " +
