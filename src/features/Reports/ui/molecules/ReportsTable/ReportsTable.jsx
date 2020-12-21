import cl from "./ReportsTable.module.css";

const ReportsTable = ({ ungenlist, handler }) => {
  const prepareUngenList = (list) => {
    return list.map((waybill) => {
      return (
        <tr>
          <td>{waybill.barcode}</td>
          <td>{new Date(waybill.printdate).toLocaleString("ru-RU").split(",")[0]}</td>
          <td>{waybill.name}</td>
          <td>
            <button onClick={() => handler(waybill.barcode)}>file</button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <table className={cl.reportstable}>
        <thead>
          <tr>
            <td>Идентификатор</td>
            <td>Дата формирования</td>
            <td>Составитель</td>
            <td>Сформировать файл</td>
          </tr>
        </thead>
        <tbody>{prepareUngenList(ungenlist)}</tbody>
      </table>
    </div>
  );
};

export { ReportsTable };
