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
  const waybillList = useStore($waybillList);
  const startPeriod = (e) => {
    e.preventDefault();
    setStartPeriod(e.target.value);
  };

  const endPeriod = (e) => {
    e.preventDefault();
    setEndPeriod(e.target.value);
  };

  const searchingWaybill = (e) => {
    setSearchingWaybill(e.target.value);
  };
  const rpoSearch = (e) => {
    if (validateBarcode(e.target.value)) searchRPO(e.target.value);
  };
  const prepareData = () => {
    if (waybillList.length > 0) {
      console.log(waybillList);
      return waybillList.map((waybill) => (
        <tr key={`package${waybill.id}`}>
          <td>{waybill.barcode}</td>
          <td>{new Date(waybill.printdate).toLocaleString("ru-RU").split(",")[0]}</td>
          <td>{waybill.userid}</td>
          <td>{waybill.firmid}</td>
          <td>{"standart"}</td>
          <td>
            <button>Просмотр</button>
          </td>
        </tr>
      ));
    }
    return null;
  };

  return (
    <div>
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
        <InputWaybills handler={(e) => searchingWaybill(e)} />
      </div>
      <div>
        Поиск РПО №
        <InputWaybills handler={rpoSearch} />
        {rpoNotFound ? <span style={{ color: "red" }}>РПО не найдено</span> : null}
      </div>
      <button onClick={search}>Поиск</button>

      <div>
        <Table handler={() => prepareData()} />
      </div>
    </div>
  );
};

//style={{ color: "red" }}
