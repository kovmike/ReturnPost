import React from "react";
import classes from "./InfoF104.module.css";
import { LineInfoF104 } from "./../../molecules/LineInfoF104";
import { LineInfoHeadF104 } from "./../../molecules/LineInfoHeadF104";
import { $f104Barcode } from "./../../../model";
import { useStore } from "effector-react";

export const InfoF104 = ({ abonBox }) => {
  const barcode = useStore($f104Barcode);
  return (
    <div className={classes.wrapper}>
      <LineInfoHeadF104 classes={classes} labelText={"СПИСОК № "} data={barcode} />
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
