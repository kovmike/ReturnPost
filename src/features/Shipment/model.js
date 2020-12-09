import { createEffect, forward, createEvent, guard, sample, createStore } from "effector";
import { formatWaybillNum, numMonth, controlDigit } from "./../../common/common.js";
const trackingURL = "http://10.106.0.253:8000/";

//показ диалога ф23
const showF23Dialog = createEvent("showComponent");
export const genBarcodef23 = createEvent();
const addToF23 = createEvent(); //добавление в список ф23 накладных ф104
const removeFromF23 = createEvent();
const denied = createEvent(); //запрет формирования ф23 с накладными ф104 за разные даты
const insertInToF23 = createEvent(); //запись ф23 в бд
const getUnshippedWaybills = createEvent();

//запрос неотгруженных накладных
const fetchUnshippedWaybillsFx = createEffect(async () => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "unshipped" } }),
  }).then((r) => r.json());
});

//запрос количества РПО входящих в в ф104
const countRPOInWaybillFx = createEffect(async (waybill) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "rpo", queryParameters: { action: "COUNT", barcode: waybill.barcode } }),
  })
    .then((r) => r.json())
    .then((count) => ({ ...waybill, count }));
});
//отметка на накладных ф104 о принадлежности к ф23
const updateF104Fx = createEffect(async (payload) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "updateF23id", ...payload } }),
  })
    .then((r) => r.json())
    .then((data) => console.log(data));
});
//формирование ШК ф23
//dry вынести эффект в общую модель (одинаковое с fetchWaybillNumberFx)
const fetchF23NumberFx = createEffect("f", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "config" }),
    })
      .then((r) => r.json())
      .then(([data]) => formatWaybillNum(+data.value)); //TODO если не пришел номер сделать обратботку
  },
});
//запись в бд, получаем Id наакладной в таблице f23
const insertInToF23Fx = createEffect(async (newF23) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f23", queryParameters: { action: "addf23", ...newF23 } }),
  }).then((r) => r.json());
});

const $f23DialogIsActive = createStore(false).on(showF23Dialog, (state, _) => !state);
const $f23barcode = createStore("").reset(updateF104Fx.doneData);
const $index = createStore("170000");
const $listF23 = createStore([])
  .on(countRPOInWaybillFx.doneData, (f23, waybill) => [...f23, waybill])
  .on(removeFromF23, (f23, { barcode }) => f23.filter((waybill) => waybill.barcode !== barcode));
const $allowedF23 = createStore(true).on(denied, (_, permit) => permit);
const $unshippedWaybills = createStore([]).on(fetchUnshippedWaybillsFx.doneData, (_, list) => list);
//$unshippedWaybills.watch((s) => console.log(s));

forward({
  from: getUnshippedWaybills,
  to: fetchUnshippedWaybillsFx,
});

forward({
  from: addToF23,
  to: countRPOInWaybillFx,
});

sample({
  source: $listF23,
  fn: (f23) => f23.every((item) => item.printdate === f23[0].printdate),
  target: denied,
});

guard({
  source: sample($f23barcode, genBarcodef23),
  filter: (barcode) => barcode.length === 0,
  target: fetchF23NumberFx,
});

sample({
  source: $index,
  clock: fetchF23NumberFx.doneData,
  fn: (index, number) => {
    let barcode = index + numMonth(new Date()) + number;
    return barcode + controlDigit(barcode);
  },
  target: $f23barcode,
});

sample({
  source: $f23barcode,
  clock: insertInToF23,
  fn: (barcode) => ({ barcode, printdate: new Date().toLocaleDateString("ru").split(".").reverse().join("-") }),
  target: insertInToF23Fx,
});

sample({
  source: $listF23,
  clock: insertInToF23Fx.doneData,
  fn: (list, id) => ({ list: list.map(({ barcode }) => barcode).join(","), id }),
  target: updateF104Fx,
});

export {
  showF23Dialog,
  $f23barcode,
  $f23DialogIsActive,
  getUnshippedWaybills,
  $unshippedWaybills,
  $allowedF23,
  addToF23,
  removeFromF23,
  $listF23,
  insertInToF23,
};
