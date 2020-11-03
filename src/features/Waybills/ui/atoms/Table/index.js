import React from "react";

const Table = ({ handler }) => {
  return (
    <table className={"classes.listOfPackages"}>
      <caption>Список накладных по введенным параметрам</caption>
      <thead>
        <tr>
          <th>№ Накладной</th>
          <th>Дата формирования</th>
          <th>Составитель</th>
          <th>а\я</th>
          <th>Тип накладной</th>
        </tr>
      </thead>
      <tbody> {handler()}</tbody>
    </table>
  );
};

export { Table };
