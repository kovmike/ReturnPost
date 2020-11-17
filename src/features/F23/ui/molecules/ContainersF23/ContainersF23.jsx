import React from "react";
import { Label, DivUnderLined, StampFull } from "./../../atoms";
import cl from "./Conteiners.module.css";

const ContainersF23 = () => {
  return (
    <div className={cl.containerswrapper}>
      <div className={cl.column}>
        <DivUnderLined text={"Подлежит обмену: "} />
        <div className={cl.smallline}>
          <Label text={"Ящик"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Мешки"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Паллеты"} />
          <DivUnderLined text={""} />
        </div>
      </div>
      <div className={cl.column}>
        <div className={cl.smallline}>
          <Label text={"Контейнер"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Ящик флэт"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Мешки авиа"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Поддоны пласт"} />
          <DivUnderLined text={""} />
        </div>
      </div>
      <StampFull />
    </div>
  );
};

export { ContainersF23 };
