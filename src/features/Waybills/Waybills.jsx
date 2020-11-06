import React from "react";
import { Table } from "./ui/atoms/Table";
import { DatePicker } from "./ui/atoms/DatePicker";
import { InputWaybills } from "./ui/atoms/InputWaybills";
import { validateBarcode } from "../../common/validateBarcode";
import {
  $waybillList,
  $rpoNotFound,
  setStartPeriod,
  setEndPeriod,
  setSearchingRpo,
  setSearchingWaybill,
  searchRPO,
  search,
} from "./model";
import { useStore } from "effector-react";

export const Waybills = () => {
  const rpoNotFound = useStore($rpoNotFound);

  const startPeriod = (e) => {
    e.preventDefault();
    setStartPeriod(e.target.value);
  };

  const endPeriod = (e) => {
    e.preventDefault();
    setEndPeriod(e.target.value);
  };

  const rpoSearch = (e) => {
    if (validateBarcode(e.target.value)) searchRPO(e.target.value);
  };

  return (
    <div>
      <h1>Накладные</h1>
      <div>
        Начало периода
        <DatePicker handler={(e) => startPeriod(e)} />
      </div>
      <div>
        Конец периода
        <DatePicker handler={(e) => endPeriod(e)} />
      </div>
      <div>
        Поиск накладной №
        <InputWaybills />
      </div>
      <div>
        Поиск РПО №
        <InputWaybills handler={rpoSearch} />
        {rpoNotFound ? <span>РПО не найдено</span> : null}
      </div>
      <button>Поиск</button>

      <div>
        <Table handler={() => {}} />
      </div>
    </div>
  );
};

//style={{ color: "red" }}
