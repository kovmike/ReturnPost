import { useStore } from "effector-react";
import React, { useEffect } from "react";
import { generateFile, $ungeneratedF104, getNotGenF104 } from "./model";
import { ReportsTable } from "./ui/molecules/ReportsTable/ReportsTable"; //TODO путь сократить сделать импорт изui\index.js

export const Reports = () => {
  const ungenlist = useStore($ungeneratedF104);
  useEffect(() => {
    getNotGenF104();
  }, []);

  const handler = (barcode) => {
    generateFile(barcode);
  };

  return (
    <div>
      <span>Список накладных ф104 без файлов</span>
      <ReportsTable ungenlist={ungenlist} handler={handler} />
    </div>
  );
};
