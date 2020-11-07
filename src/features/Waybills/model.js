import { createStore, createEffect, createEvent, sample, combine, guard, forward } from "effector";

const trackingURL = "http://10.106.0.253:8000/";
const today = new Date().toLocaleDateString("ru").split(".").reverse().join("-");

const search = createEvent();
const setStartPeriod = createEvent();
const setEndPeriod = createEvent();
const setSearchingRpo = createEvent();
const setSearchingWaybill = createEvent();
const searchRPO = createEvent();

const $startPeriod = createStore({ start: "2000-01-01" }); //-> 01012000
const $endPeriod = createStore({ end: today }); // -> today
const $rpo = createStore({ rpo: "" });
const $waybillBarcode = createStore({ waybill: "" });
const $waybillList = createStore([]);
const $rpoNotFound = createStore(false);

//$rpoNotFound.watch((s) => console.log(s));
const searchRPOFx = createEffect(async (rpo) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "rpo", queryParameters: { action: "SELECT", barcode: `${rpo}` } }),
  }).then((r) => r.json());
});

const fetchListWaybillFx = createEffect(async (what) => {
  console.log(what);
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "waybill", queryParameters: { action: "select", ...what } }),
  }).then((r) => r.json());
});

$waybillList.on(fetchListWaybillFx.doneData, (_, list) => list);
$startPeriod.on(setStartPeriod, (_, start) => ({ start }));
$endPeriod.on(setEndPeriod, (_, end) => ({ end }));
$rpo.on(setSearchingRpo, (_, rpo) => ({ rpo }));
$waybillBarcode
  .on(setSearchingWaybill, (_, waybill) => ({ waybill }))
  .on(searchRPOFx.doneData, (state, waybill) => (waybill === 0 ? state : { waybill }));

//$waybillBarcode.watch((s) => console.log(s));

/***** */

//поиск по параметрам: дата начала периода, дата конца периода, номер накладной
sample({
  source: combine($startPeriod, $endPeriod, $waybillBarcode, (start, end, waybill) => ({
    ...start,
    ...end,
    ...waybill,
  })),
  clock: search,
  target: fetchListWaybillFx,
});

//поиск накладной по номеру РПО
forward({
  from: searchRPO,
  to: searchRPOFx,
});
//проверка найденного рпо
sample({
  source: searchRPOFx.doneData,
  fn: (resp) => !resp,
  target: $rpoNotFound,
});

export {
  $rpoNotFound,
  $waybillList,
  setStartPeriod,
  setEndPeriod,
  setSearchingRpo,
  setSearchingWaybill,
  search,
  searchRPO,
};
