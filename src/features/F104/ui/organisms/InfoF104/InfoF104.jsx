import React from "react";
import classes from "./InfoF104.module.css";
import { LineInfoF104 } from "./../../molecules/LineInfoF104";
import { LineInfoHeadF104 } from "./../../molecules/LineInfoHeadF104";

export const InfoF104 = ({ abonBox, barcode }) => {
  const formatingDate = () => {
    const now = new Date();
    //.match(/[0-9\-]+(?=T)/g));

    return [
      now.getDate(),
      now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1,
      now.getFullYear(),
    ].join(".");
  };
  return (
    <div className={classes.wrapper}>
      <LineInfoHeadF104 classes={classes} labelText={"СПИСОК № "} data={barcode} />
      <LineInfoHeadF104
        classes={classes}
        labelText={"возвращенных почтовых отправлений КАТЕГОРИЯ :"}
        data={`СТАНДАРТНЫЕ`}
      />
      <LineInfoHeadF104 classes={classes} labelText={"От :"} data={formatingDate()} />

      <div className={classes.names}>
        <LineInfoF104
          classes={classes}
          labelText={"Выданных в : "}
          name={"Тверской почтамт"}
          objectName={"наименование объекта почтовой связи места вручения"}
        />
        <LineInfoF104
          classes={classes}
          labelText={"Получатель : "}
          name={abonBox}
          objectName={"наименование организации"}
        />
        <LineInfoF104 classes={classes} labelText={""} name={""} objectName={"адрес"} />
      </div>
    </div>
  );
};
