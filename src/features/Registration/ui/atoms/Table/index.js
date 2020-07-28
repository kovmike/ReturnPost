import React from "react";
import classes from "./Table.module.css";

export const Table = ({ handler }) => {
  return (
    <table className={classes.listOfPackages}>
      <caption>Приписанные отправления</caption>
      <thead>
        <tr>
          <th>№</th>
          <th>Вид отправления</th>
          <th>Идентификатор</th>
          <th>Индекс МН</th>
          <th>Вес</th>
          <th>Сумма ОЦ</th>
          <th>Сумма НП</th>
          <th>Способ пересылки</th>
          <th>Авиатариф</th>
          <th>Общая сумма за возврат</th>
        </tr>
      </thead>
      <tbody> {handler()}</tbody>
    </table>
  );
};
