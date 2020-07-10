import React, { useState } from "react";
import { useStore } from "effector-react";
import classes from "./Registration.module.css";
import { enteringBarcode, $packageList } from "./../../model/model";
import { Button } from "./../../ui/atoms/Button";

export const Registration = () => {
  const packageList = useStore($packageList);
  const [barcode, setBarcode] = useState(null);

  const click = () => {
    const data = barcode ? { barcode: `${barcode}` } : { barcode: "17095247999439" };
    enteringBarcode(data);
  };

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };
  const prepareList = () => {
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
        <tbody> {prepareList()}</tbody>
      </table>
    </div>
  );
};
