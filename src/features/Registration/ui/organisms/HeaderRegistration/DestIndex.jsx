import React from "react";
import { Label, Select } from "./../../atoms/index";

export const DestIndex = ({ arrOfIndexes, handler, value }) => {
  return (
    <div>
      <Label text="Выберите индекс: " />
      <Select arr={arrOfIndexes} handler={handler} value={value} />
    </div>
  );
};
