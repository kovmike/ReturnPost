import React from "react";
import classes from "./InfoF104.module.css";
import { LineInfoF104 } from "./../../molecules/LineInfoF104";
import { LineInfoHeadF104 } from "./../../molecules/LineInfoHeadF104";

export const InfoF104 = ({ abonBox }) => {
  return (
    <div className={classes.wrapper}>
      <LineInfoHeadF104 classes={classes} labelText={"СПИСОК № "} data={`  1234567890128  `} />
      <LineInfoHeadF104
        classes={classes}
        labelText={"возвращенных почтовых отправлений КАТЕГОРИЯ :"}
        data={`СТАНДАРТНЫЕ`}
      />
      <LineInfoHeadF104 classes={classes} labelText={"От :"} data={`21.07.2020`} />

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
