import cl from "./OASUTable.module.css";

const OASUTable = ({ ungenlist, handler }) => {
  const prepareUngenList = (list) => {
    return list.map((waybill) => {
      return (
        <tr>
          <td>{waybill.barcode}</td>
          <td>{new Date(waybill.printdate).toLocaleString("ru-RU").split(",")[0]}</td>
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
            <td>Сформировать файл</td>
          </tr>
        </thead>
        <tbody>{prepareUngenList(ungenlist)}</tbody>
      </table>
    </div>
  );
};

export { OASUTable };
