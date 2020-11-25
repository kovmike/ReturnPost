import cl from "./ShipmentTable.module.css";

const ShipmentTable = ({ unshippedList }) => {
  const prepareListWaybills = (list) => {
    return list.map((waybill) => {
      return (
        <tr>
          <td>{waybill.barcode}</td>
          <td>{new Date(waybill.printdate).toLocaleString("ru-RU").split(",")[0]}</td>
          <td>{waybill.userid}</td>
          <td>{waybill.firmid}</td>
          <td>{waybill.waybilltype}</td>
        </tr>
      );
    });
  };
  return (
    <div>
      <table className={cl.listOfwaybills}>
        <thead>
          <tr>
            <th>№ накладной </th>
            <th>Дата</th>
            <th>Составитель</th>
            <th>а/я</th>
            <th>Тип накладной</th>
          </tr>
        </thead>
        <tbody>{prepareListWaybills(unshippedList)}</tbody>
      </table>
    </div>
  );
};

export { ShipmentTable };
