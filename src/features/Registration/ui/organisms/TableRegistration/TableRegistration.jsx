import React, { useState } from "react";
import { useStore } from "effector-react";
import { Input, Button, Table } from "./../../atoms";
import { enteringBarcode, $packageList, $allowed } from "./../../../model.js";
import { validateBarcode } from "../../../../../common/validateBarcode";
import classes from "./TableRegistration.module.css";

const TableRegistration = () => {
  const packageList = useStore($packageList);
  const allowed = useStore($allowed);
  const [barcode, setBarcode] = useState("");

  const onChangeInput = (e) => {
    setBarcode(e.target.value);
  };

  const addPackage = () => {
    if (validateBarcode(barcode)) {
      enteringBarcode({ barcode: `${barcode}` });
      setBarcode("");
    } else {
      setBarcode("");
      console.log("wrong BC");
    }
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
        disabled={allowed}
        value={barcode}
        onEnterPress={addPackage}
        handler={(e) => {
          onChangeInput(e);
        }}
      />
      <Button disabled={allowed} title="Приписать" handler={addPackage} />
      <Table handler={preparePackList} />
    </div>
  );
};

export { TableRegistration };
