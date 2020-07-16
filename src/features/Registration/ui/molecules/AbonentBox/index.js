import React, { createRef } from "react";
import { Label, Button } from "./../../index";

export const AbonentBox = ({ abonBoxNumber, abonBoxList, pickAbonBox, addToClearButton }) => {
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

  return (
    <div>
      <Label text={abonBoxNumber ? "Выбран: " : "Выберите А/Я: "} />
      <input ref={abonBoxRef} list="dataListId" onChange={pickAbonBox}></input>
      <datalist id="dataListId">{prepareList(abonBoxList)}</datalist>
      <Button handler={clearABInput} title="Очистить" />
    </div>
  );
};
