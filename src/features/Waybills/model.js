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
const rpoNotFound = createEvent();
const resetWaybillBarcode = createEvent();
const resetWayBillList = createEvent();

const $startPeriod = createStore({ start: "2000-01-01" }); //-> 01012000
const $endPeriod = createStore({ end: today }); // -> today
const $rpo = createStore({ rpo: "" });
const $waybillBarcode = createStore({ waybill: "" }).reset(resetWaybillBarcode);
const $waybillList = createStore([]).reset(resetWayBillList);
const $rpoNotFound = createStore(false).reset(setSearchingWaybill); //возвращаем к дефолтному значению если нашли рпо

//$waybillBarcode.watch((s) => console.log(s));
//поиск в таблице rpo накладной по введенному ШК
const searchRPOFx = createEffect(async (rpo) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "rpo", queryParameters: { action: "SELECT", barcode: `${rpo}` } }),
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

$waybillList.on(fetchListWaybillFx.doneData, (_, list) => list);
$startPeriod.on(setStartPeriod, (_, start) => ({ start }));
$endPeriod.on(setEndPeriod, (_, end) => ({ end }));
$rpo.on(setSearchingRpo, (_, rpo) => ({ rpo }));
$waybillBarcode.on(setSearchingWaybill, (_, waybill) => ({ waybill }));
//.on(searchRPOFx.doneData, (state, waybill) => (waybill === 0 ? state : { waybill }));

$waybillBarcode.watch((s) => console.log(s));

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
    //если пользовательне админ, то добавляем его к запросу
    if (+user.isAdmin === 0) return { ...res, user: user.userName };
    return res;
  }),
  clock: search,
  target: fetchListWaybillFx,
});

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
};
