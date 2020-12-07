import { useStore } from "effector-react";
import React, { useEffect } from "react";
import { generateFile, $ungeneratedF104, getNotGenF104 } from "./model";
import { ReportsTable } from "./ui/molecules/ReportsTable/ReportsTable"; //TODO путь сократить сделать импорт изui\index.js

export const Reports = () => {
  useEffect(() => {
    getNotGenF104();
  }, []);
  const ungenlist = useStore($ungeneratedF104);

  return (
    <div>
      <span>Список накладных ф104 без файлов</span>
      <ReportsTable ungenlist={ungenlist} handler={generateFile} />
    </div>
  );
};
