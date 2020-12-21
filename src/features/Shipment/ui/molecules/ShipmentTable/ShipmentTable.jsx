import cl from "./ShipmentTable.module.css";

const ShipmentTable = ({ unshippedList, removeFromF23, addToF23 }) => {
  const prepareListWaybills = (list) => {
    const includeToF23 = (e, item) => {
      e.target.checked ? addToF23(item) : removeFromF23(item);
    };
    return list.map((waybill) => {
      return (
        <tr>
          <td>{waybill.barcode}</td>
          <td>{new Date(waybill.printdate).toLocaleString("ru-RU").split(",")[0]}</td>
          <td>{waybill.name}</td>
          <td>{waybill.firmname}</td>
          <td>{waybill.type}</td>
          <td>{waybill.containernum}</td>
          <td>{waybill.stampnum}</td>
          <td>
            <input type="checkbox" onChange={(e) => includeToF23(e, waybill)} />
          </td>
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
            <th>№ контейнера</th>
            <th>№ пломбы</th>
            <th>Включить в ф.23</th>
          </tr>
        </thead>
        <tbody>{prepareListWaybills(unshippedList)}</tbody>
      </table>
    </div>
  );
};

export { ShipmentTable };
