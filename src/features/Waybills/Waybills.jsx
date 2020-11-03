import React from "react";
import { Table } from "./ui/atoms/Table";
import { DatePicker } from "./ui/atoms/DatePicker";
import { InputWaybills } from "./ui/atoms/Input";

export const Waybills = () => {
  const setBeginPeriod = () => {};
  const setEndPeriod = () => {};
  return (
    <div>
      <h1>Накладные</h1>
      <div>
        Начало периода
        <DatePicker handler={setBeginPeriod} />
      </div>
      <div>
        Конец периода
        <DatePicker handler={setEndPeriod} />
      </div>
      <div>
        Поиск накладной №
        <InputWaybills handler={setBeginPeriod} />
      </div>
      <div>
        Поиск РПО №
        <InputWaybills handler={setEndPeriod} />
      </div>

      <div>
        <Table handler={setEndPeriod} />
      </div>
    </div>
  );
};
