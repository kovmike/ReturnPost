import React from "react";

import classes from "./TableF104.module.css";
import { digToText } from "../../../model";

export const TableF104 = ({ packageList }) => {
  /**
   * Экспортировать функцию подготовки списка из фичи регистрации(DRY)
   */
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
    <div className={classes.wrapper}>
      <table className={classes.listOfPackages}>
        <thead>
          <tr>
            <th>№</th>
            <th>Вид отправления</th>
            <th>Идентификатор</th>
            <th>Индекс места назначения</th>
            <th>Вес</th>
            <th>Сумма ОЦ</th>
            <th>Сумма НП</th>
            <th>Способ пересылки</th>
            <th>Авиатариф</th>
            <th>Общая сумма за возврат</th>
          </tr>
        </thead>
        <tbody> {preparePackList()}</tbody>
      </table>
      <div className={classes.line}>
        <label className={classes.mark}>Общее количество почтовых отправлений:&nbsp;</label>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>{`${Object.keys(packageList).length} ( ${digToText(
            Object.keys(packageList).length
          )} ) шт`}</div>
          <div className={classes.description}>(сумма в цифрах и прописью)</div>
        </div>
      </div>
    </div>
  );
};
