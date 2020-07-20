import React from "react";
import classes from "./Table.module.css";

export const Table = ({ handler }) => {
  return (
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
      <tbody> {handler()}</tbody>
    </table>
  );
};
