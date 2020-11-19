import React from "react";
import { Label, DivUnderLined, StampFull } from "./../../atoms";
import cl from "./Conteiners.module.css";

const ContainersF23 = () => {
  return (
    <div className={cl.containerswrapper}>
      <div className={cl.column}>
        <DivUnderLined text={"Подлежит обмену: "} />
        <div className={cl.smallline}>
          <Label text={"Ящик"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Мешки"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Паллеты"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
      </div>
      <div className={cl.column}>
        <div className={cl.smallline}>
          <Label text={"Контейнер"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Ящик флэт"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Мешки авиа"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
        <div className={cl.smallline}>
          <Label text={"Поддоны пласт"} size={"12"} />
          <DivUnderLined text={""} />
        </div>
      </div>
      <StampFull />
    </div>
  );
};

export { ContainersF23 };
