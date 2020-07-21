import React from "react";

import classes from "./TableF104.module.css";

export const TableF104 = () => {
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
        <tbody> {null}</tbody>
      </table>
      <div className={classes.line}>
        <label className={classes.mark}>Общее количество почтовых отправлений:&nbsp;</label>
        <div className={classes.withDescription}>
          <div className={classes.divUnderlined}>500</div>
          <div className={classes.description}>(сумма в цифрах и прописью)</div>
        </div>
      </div>
    </div>
  );
};
