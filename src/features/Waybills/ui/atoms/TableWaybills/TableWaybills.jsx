import React from "react";
import classes from "./TableWaybills.module.css";

const TableWaybills = ({ handler }) => {
  return (
    <table className={classes.listOfwaybills}>
      <caption>Список накладных по введенным параметрам</caption>
      <thead>
        <tr>
          <th>№ Накладной</th>
          <th>Дата формирования</th>
          <th>Составитель</th>
          <th>а\я</th>
          <th>Тип накладной</th>
          <th>Просмотр</th>
        </tr>
      </thead>
      <tbody> {handler()}</tbody>
    </table>
  );
};

export { TableWaybills };
