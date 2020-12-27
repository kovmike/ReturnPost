import { createStore, createEffect, createEvent, sample, combine, forward, split } from "effector";
import { $loggedUser } from "./../Auth/model";
const trackingURL = "http://10.106.0.253:8000/";
const today = new Date().toLocaleDateString("ru").split(".").reverse().join("-");

const search = createEvent();
const setStartPeriod = createEvent();
const setEndPeriod = createEvent();
const setSearchingRpo = createEvent();
const setSearchingWaybill = createEvent();
const searchRPO = createEvent();
const startFetchingDataForPreviewF104 = createEvent();
const startFetchingDataForPreviewF23 = createEvent();
const rpoNotFound = createEvent();
const resetWaybillBarcode = createEvent();
const resetWayBillList = createEvent();
const showPreviewF104 = createEvent();
const showPreviewF23 = createEvent();

//$waybillBarcode.watch((s) => console.log(s));
//поиск в таблице rpo накладной по введенному ШК
const searchRPOFx = createEffect(async (rpo) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "rpo", queryParameters: { action: "SELECT", barcode: `${rpo}` } }),
  }).then((r) => r.json());
});

//запрос на просмотр накладной ф104
const fetchF104DataForPreviewFx = createEffect(async (barcode) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "preview", barcode } }),
  }).then((r) => r.json());
});
//запрос на просмотр накладной ф23
const fetchF23DataForPreviewFx = createEffect(async (barcode) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f23", queryParameters: { action: "preview", barcode } }),
  }).then((r) => r.json());
});

//поиск списка накладных по параметрам
const fetchListWaybillFx = createEffect(async (what) => {
  console.log(what);
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "select", ...what } }),
  }).then((r) => r.json());
});

const $startPeriod = createStore({ start: "2000-01-01" }).on(setStartPeriod, (_, start) => ({ start })); //-> 01012000
const $endPeriod = createStore({ end: today }).on(setEndPeriod, (_, end) => ({ end })); // -> today
//const $rpo = createStore({ rpo: "" }).on(setSearchingRpo, (_, rpo) => ({ rpo }));
const $waybillBarcode = createStore({ waybill: "" })
  .on(setSearchingWaybill, (_, waybill) => ({ waybill }))
  .reset(resetWaybillBarcode);
const $waybillList = createStore([])
  .on(fetchListWaybillFx.doneData, (_, list) => list)
  .reset(resetWayBillList);
const $rpoNotFound = createStore(false).reset(setSearchingWaybill); //возвращаем к дефолтному значению если нашли рпо
const $f104DataforPreview = createStore({}).on(fetchF104DataForPreviewFx.doneData, (_, data) => data);
const $f104PreviewDialog = createStore(false).on(showPreviewF104, (show, _) => !show);

const $f23DataForPreview = createStore({}).on(fetchF23DataForPreviewFx.doneData, (_, data) => data);
const $f23PreviewDialog = createStore(false).on(showPreviewF23, (show, _) => !show);

//.on(searchRPOFx.doneData, (state, waybill) => (waybill === 0 ? state : { waybill }));

$f23PreviewDialog.watch((s) => console.log(s));

/***** */

//поиск по параметрам: дата начала периода, дата конца периода, номер накладной
sample({
  source: combine($startPeriod, $endPeriod, $waybillBarcode, $loggedUser, (start, end, waybill, user) => {
    const res = {
      ...start,
      ...end,
      ...waybill,
      user: "",
    };
    //если пользовательне не админ, то добавляем его к запросу
    if (+user.isAdmin === 0) return { ...res, user: user.userId };
    return res;
  }),
  clock: search,
  target: fetchListWaybillFx,
});

//
forward({
  from: fetchListWaybillFx.done,
  to: resetWaybillBarcode,
});

//поиск накладной по номеру РПО
forward({
  from: searchRPO,
  to: searchRPOFx,
});

//проверка найденного рпо
split({
  source: searchRPOFx.doneData,
  match: {
    found: (data) => data !== 0,
    notFound: (data) => data === 0,
  },
  cases: {
    found: setSearchingWaybill,
    notFound: rpoNotFound,
  },
});
//если рпо не найдено, включается флаг на показ сообщения "РПО не найдено"
sample({
  source: $rpoNotFound,
  clock: rpoNotFound,
  fn: (resp) => !resp,
  target: $rpoNotFound,
});

/***
 * просмотр накладных
 */

//запрос на просмотр ф104
forward({
  from: startFetchingDataForPreviewF104,
  to: fetchF104DataForPreviewFx,
});
forward({
  from: fetchF104DataForPreviewFx.done,
  to: showPreviewF104,
});
//запрос на просмотр ф23
forward({
  from: startFetchingDataForPreviewF23,
  to: fetchF23DataForPreviewFx,
});
forward({
  from: fetchF23DataForPreviewFx.done,
  to: showPreviewF23,
});

export {
  $rpoNotFound,
  $waybillList,
  $waybillBarcode,
  setStartPeriod,
  setEndPeriod,
  setSearchingRpo,
  setSearchingWaybill,
  search,
  searchRPO,
  resetWayBillList,
  $f104DataforPreview,
  $f23DataForPreview,
  startFetchingDataForPreviewF104,
  startFetchingDataForPreviewF23,
  $f104PreviewDialog,
  $f23PreviewDialog,
  showPreviewF104,
  showPreviewF23,
};
