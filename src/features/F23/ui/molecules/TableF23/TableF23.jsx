import cl from "./TableF23.module.css";

const TableF23 = ({ list }) => {
  const prepareListF23 = (arr) => {
    return arr.map((waybill) => {
      return (
        <tr>
          <td className={cl.cell}>{waybill.barcode}</td>
          <td className={cl.cell}>{waybill.type}</td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}></td>
          <td className={cl.cell}>1?</td>
          <td className={cl.cell}>{waybill.count}</td>
        </tr>
      );
    });
  };
  return (
    <div className={cl.tableF23wrapper}>
      <table className={cl.listOfPackages}>
        <thead>
          <tr>
            <th rowSpan={3} className={cl.tableHeaders}>
              ОПС назначения Идентификатор номер накладной
            </th>
            <th rowSpan={3} className={cl.tableHeaders}>
              Вид емкости
            </th>
            <th colSpan={11} className={cl.tableHeaders}>
              ЕМКОСТИ
            </th>
            <th rowSpan={3} className={cl.tableHeaders}>
              Всего емкостей
            </th>
            <th rowSpan={3} className={cl.tableHeaders}>
              Всего РПО пересылаемых открыто
            </th>
          </tr>
          <tr>
            <th rowSpan={2} className={cl.capacity}>
              C отпр 1кл
            </th>
            <th rowSpan={2} className={cl.capacity}>
              EMS
            </th>
            <th rowSpan={2} className={cl.capacity}>
              Правительственные
            </th>
            <th rowSpan={2} className={cl.capacity}>
              Международные
            </th>
            <th rowSpan={2} className={cl.capacity}>
              Страховые
            </th>
            <th rowSpan={2} className={cl.capacity}>
              С заказной корресп
            </th>
            <th colSpan={2} className={cl.capacity}>
              С простой корреспонденцией
            </th>
            <th rowSpan={2} className={cl.capacity}>
              C печатью
            </th>
            <th rowSpan={2} className={cl.capacity}>
              Порожняя тара
            </th>
            <th rowSpan={2} className={cl.capacity}>
              Группа РПО
            </th>
          </tr>
          <tr>
            <th className={cl.capacity}>Колво</th>
            <th className={cl.capacity}>Вес, (кг)</th>
          </tr>
        </thead>
        <tbody>{prepareListF23(list)}</tbody>
      </table>
    </div>
  );
};

export { TableF23 };
