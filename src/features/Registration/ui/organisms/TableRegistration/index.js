import React, { useState } from "react";
import { useStore } from "effector-react";
import { Input, Button, Table } from "./../../atoms";
import { enteringBarcode, $packageList } from "./../../../model.js";

import classes from "./TableRegistration.module.css";

const TableRegistration = () => {
  const packageList = useStore($packageList);
  // const destinationIndex = useStore($destinationIndex);
  const [barcode, setBarcode] = useState("");

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };

  const addPackage = () => {
    /**
     * TODO
     * сделать валидацию поля(возможно вообще в форму вынести все!!)
     */
    const data = barcode ? { barcode: `${barcode}` } : { barcode: "17095247999439" };
    //очищаем строку
    setBarcode("");
    enteringBarcode(data);
  };

  //формирование списка приписанных отправлений
  const preparePackList = () => {
    if (Object.keys(packageList).length !== 0) {
      return Object.keys(packageList).map((pack, index) => (
        <tr key={`package${index}`}>
          <td className={classes.tableCell}>{+index + 1}</td>
          <td className={classes.tableCell}>{packageList[pack].name}</td>
          <td className={classes.tableCell}>{pack}</td>
          <td className={classes.tableCell}>{packageList[pack].destinationIndex}</td>
          <td className={classes.tableCell}>{packageList[pack].weight}</td>
          <td className={classes.tableCell}>{packageList[pack].sumoc}</td>
          <td className={classes.tableCell}>{packageList[pack].sumCover}</td>
          <td className={classes.tableCell}>{packageList[pack].shipmentMethod}</td>
          <td className={classes.tableCell}>{packageList[pack].aviaTariff}</td>
          <td className={classes.tableCell}>{packageList[pack].paynds}</td>
        </tr>
      ));
    }
    return null;
  };

  return (
    <div>
      <Input
        value={barcode}
        handler={(e) => {
          onChangeInput(e);
        }}
      />
      <Button title="Приписать" handler={addPackage} />
      <Table handler={preparePackList} />
    </div>
  );
};

export { TableRegistration };
