import React from "react";
import { TableWaybills } from "./ui";
import { DatePicker } from "./ui/atoms/DatePicker";
import { InputWaybills } from "./ui/atoms/InputWaybills";
import { validateBarcode } from "../../common/validateBarcode";
import {
  $waybillList,
  $rpoNotFound,
  $waybillBarcode,
  setStartPeriod,
  setEndPeriod,
  setSearchingWaybill,
  searchRPO,
  search,
  startFetchingDataForPreviewF104,
  startFetchingDataForPreviewF23,
  $f104PreviewDialog,
  $f104DataforPreview,
  $f23DataForPreview,
  showPreviewF104,
  $f23PreviewDialog,
  showPreviewF23,
} from "./model";
import { useStore } from "effector-react";
import { F104 } from "./../F104";
import { F23 } from "./../F23";

export const Waybills = () => {
  const rpoNotFound = useStore($rpoNotFound);
  const waybillList = useStore($waybillList);
  const { waybill } = useStore($waybillBarcode);
  const previewF104Dialog = useStore($f104PreviewDialog);
  const previewF23Dialog = useStore($f23PreviewDialog);
  const { f104, rpo } = useStore($f104DataforPreview);
  const f23DataForPreview = useStore($f23DataForPreview);

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

  const preview = (barcode, type) => {
    if (+type === 2) {
      startFetchingDataForPreviewF23(barcode);
    } else {
      startFetchingDataForPreviewF104(barcode);
    }
  };

  //сделать чистую функцию
  const prepareData = () => {
    if (waybillList.length > 0) {
      //console.log(waybillList);
      return waybillList
        .sort((current, next) => new Date(current.printdate) - new Date(next.printdate))
        .map((waybill) => (
          <tr key={`package${waybill.barcode}`}>
            <td>{waybill.barcode}</td>
            <td>{new Date(waybill.printdate).toLocaleString("ru-RU").split(",")[0]}</td>
            <td>{waybill.name ?? "-"}</td>
            <td>{waybill.firmname ?? "-"}</td>
            <td>{waybill.type}</td>
            <td>
              <button onClick={() => preview(waybill.barcode, waybill.waybilltypeid)}>Просмотр</button>
            </td>
          </tr>
        ));
    }
    return null;
  };

  //лютейшая подгонка данных
  /**
   *
   * тк на бд и в программе разные имена свойств(надо поменять)
   */
  const preparePreviewList = (list) => {
    return list
      .map((pack) => ({
        ...pack,
        destinationIndex: pack.indexto,
        typ: pack.mailtype,
        shipmentMethod: pack.transtype,
        sumCover: pack.sumcover,
        paynds: pack.paynds / 100,
        pay: pack.pay / 100,
        nds: pack.nds / 100,
      }))
      .reduce((acc, curr) => ({ ...acc, [curr.barcode]: curr }), {});
  };

  return (
    <div>
      {previewF23Dialog ? (
        <F23
          barcode={f23DataForPreview.f23[0].barcode}
          list={f23DataForPreview.f104}
          showComponentDialog={showPreviewF23}
        />
      ) : null}
      {previewF104Dialog ? (
        <F104
          selectedAbonBox={[{ abonentbox: f104[0].abonentbox, firmname: f104[0].firmname }]} //переделать
          packageList={preparePreviewList(rpo)}
          user={f104[0].name}
          f104Barcode={f104[0].barcode}
          container={f104[0].containernum}
          stamp={f104[0].stampnum}
          defect={f104[0].waybilltypeid === 5}
          showComponentDialog={showPreviewF104}
        />
      ) : null}
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
        <InputWaybills handler={(e) => searchingWaybill(e)} value={waybill} />
      </div>
      <div>
        Поиск РПО №
        <InputWaybills handler={rpoSearch} />
        {rpoNotFound ? <span style={{ color: "red" }}>РПО не найдено</span> : null}
      </div>
      <button onClick={search}>Поиск</button>
      <hr />
      <div>
        <TableWaybills handler={() => prepareData()} />
      </div>
    </div>
  );
};

//style={{ color: "red" }}
