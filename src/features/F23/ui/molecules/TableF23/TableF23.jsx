import cl from "./TableF23.module.css";

const TableF23 = () => {
  return (
    <div className={cl.tableF23wrapper}>
      <table className={cl.listOfPackages}>
        <thead>
          <tr>
            <th className={cl.tableHeaders}>ОПС назначения Идентификатор номер накладной</th>
            <th className={cl.tableHeaders}>Вид емкости</th>
            <th className={cl.tableHeaders + " " + cl.simpleCorr}>
              ЕМКОСТИ
              <tr className={cl.innerRow}>
                <th className={cl.capacity + " " + cl.leftInnerCell}>C отпр 1кл</th>
                <th className={cl.capacity}>EMS</th>
                <th className={cl.capacity}>Правительственные</th>
                <th className={cl.capacity}>Международные</th>
                <th className={cl.capacity}>Страховые</th>
                <th className={cl.capacity}>С заказной корресп</th>
                <th className={cl.capacity + " " + cl.simpleCorr}>
                  С простой корреспонденцией
                  <tr>
                    <th className={cl.capacity + " " + cl.leftInnerCell}>Колво</th>
                    <th className={cl.capacity + " " + cl.rightInnerCell}>Вес, (кг)</th>
                  </tr>
                </th>
                <th className={cl.capacity}>C печатью</th>
                <th className={cl.capacity}>Порожняя тара</th>
                <th className={cl.capacity + " " + cl.rightInnerCell}>Группа РПО</th>
              </tr>
            </th>
            <th className={cl.tableHeaders}>Всего емкостей</th>
            <th className={cl.tableHeaders}>Всего РПО пересылаемых открыто</th>
          </tr>
        </thead>
        <tbody> </tbody>
      </table>
    </div>
  );
};

export { TableF23 };
