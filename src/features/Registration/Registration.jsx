import React, { useState } from "react";
import { useStore } from "effector-react";
import classes from "./Registration.module.css";
import { enteringBarcode, $packageList } from "./model";
import { HeaderRegistration } from "./ui/organisms/HeaderRegistration";
import * as UI from "./ui";

export const Registration = () => {
  const packageList = useStore($packageList);
  const [barcode, setBarcode] = useState(null);
  const addPackage = () => {
    /**
     * TODO
     * сделать валидацию поля(возможно вообще в форму вынести все!!)
     */
    const data = barcode ? { barcode: `${barcode}` } : { barcode: "17095247999439" };

    enteringBarcode(data);
  };

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };

  //формирование списка приписанных отправлений
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

  return (
    <div>
      <HeaderRegistration />

      <hr />

      <input type="text" onChange={onChangeInput}></input>
      <UI.Button title="Приписать" handler={addPackage} />
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
