import React, { useState } from "react";
import { useStore } from "effector-react";
import classes from "./Registration.module.css";
import {
  enteringBarcode,
  $packageList,
  selectAbonBox,
  $selectedAbonBox,
  $abonBoxList,
} from "./model";
import { Button } from "./../../ui/atoms/Button";

export const Registration = () => {
  const packageList = useStore($packageList);
  const abonBoxList = useStore($abonBoxList);
  const selectedAbonBox = useStore($selectedAbonBox);
  const [barcode, setBarcode] = useState(null);

  const click = () => {
    const data = barcode
      ? { barcode: `${barcode}` }
      : { barcode: "17095247999439" };

    enteringBarcode(data);
  };

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };

  const preparePackList = () => {
    if (Object.keys(packageList).length !== 0) {
      return Object.keys(packageList).map((pack, index) => (
        <tr key={`package${index}`}>
          <td className={classes.tableCell}>{+index + 1}</td>
          <td className={classes.tableCell}>{pack}</td>
          <td className={classes.tableCell}>{packageList[pack].name}</td>
          <td className={classes.tableCell}>170044</td>
          <td className={classes.tableCell}>{packageList[pack].weight}</td>
          <td className={classes.tableCell}>{packageList[pack].paynds}</td>
        </tr>
      ));
    }
    return null;
  };

  const changeSearchAbonBox = (e) => {
    //проверяем длину инпута, только после выделения нужного а/я вызываем евент
    if (e.target.value.length > 5)
      selectAbonBox(e.target.value.split(":")[0].trim());
    // console.log(e.target.value.split(":")[0].trim());
  };

  //подготовка списка абонентских ящиков
  const prepareABList = () => {
    return abonBoxList.map((abonBox) => {
      return (
        <option value={abonBox.abonentbox + " : " + abonBox.firmname}>
          {"ID: " + abonBox.id}
        </option>
      );
    });
  };
  const clearInput = () => {};
  return (
    <div>
      <select name="destinationIndex">
        <option value="0" disabled selected>
          Выберите индекс
        </option>
        <option value="170044">170044</option>
        <option value="170965">170965</option>
      </select>
      <input list="abonBoxList" onChange={changeSearchAbonBox}></input>
      <datalist id="abonBoxList">{prepareABList()}</datalist>
      <button onClick={clearInput}>X</button>
      <label>
        {selectedAbonBox[0]?.abonentbox + " : " + selectedAbonBox[0]?.firmname}
      </label>
      <hr />
      <input type="text" onChange={onChangeInput}></input>
      <Button title="Приписать" handler={click} />
      <hr />
      <table className={classes.listOfPackages}>
        <caption>Приписанные отправления</caption>
        <thead>
          <tr>
            <th>№</th>
            <th>ШК отправления</th>
            <th>Вид отправления</th>
            <th>Индекс приписки</th>
            <th>Масса</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody> {preparePackList()}</tbody>
      </table>
    </div>
  );
};
