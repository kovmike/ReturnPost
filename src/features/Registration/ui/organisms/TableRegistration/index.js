import React, { useState } from "react";
import { useStore } from "effector-react";
import { Input, Button, Table } from "./../../atoms";
import { enteringBarcode, $packageList, $allowed } from "./../../../model.js";
import classes from "./TableRegistration.module.css";

const TableRegistration = () => {
  const packageList = useStore($packageList);
  const allowed = useStore($allowed);
  const [barcode, setBarcode] = useState("");

  const validateBarcode = (verifiable) => {
    //проверка на пустоту заполнения инпута с ШК
    if (verifiable === "") return false;
    //определяем контрольный разряд
    const control = verifiable.slice(-1);
    //выделяем часть ШК из которой будет высчитываться контрольный разряд
    const trimmed = verifiable.slice(0, -1).split("");
    //расчет контрольного разряда
    const sumOdd =
      trimmed.reduce((sum, item, index) => {
        return index % 2 === 0 ? (sum += +item) : sum;
      }, 0) * 3;
    const sumEven = trimmed.reduce((sum, item, index) => {
      return index % 2 === 1 ? (sum += +item) : sum;
    }, 0);
    /**
     * возвращаем равенство вычисленного разряда и представленного в ШК(+проверка если контрольный разряд  === 0)
     */
    return (sumEven + sumOdd) % 10 === 0
      ? (sumEven + sumOdd) % 10 === +control
      : 10 - ((sumEven + sumOdd) % 10) === +control;
  };

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
