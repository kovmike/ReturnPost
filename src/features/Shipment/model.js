import { createEffect, forward, createEvent, guard, sample, createStore } from "effector";
import { formatWaybillNum, numMonth, controlDigit } from "./../../common/common.js";
const trackingURL = "http://10.106.0.253:8000/";

//показ диалога ф23
const showF23Dialog = createEvent("showComponent");
export const genBarcodef23 = createEvent();
export const resetF23Barcode = createEvent();

const $f23DialogIsActive = createStore(false).on(showF23Dialog, (state, _) => !state);
export const $f23barcode = createStore("").reset(resetF23Barcode);
const $index = createStore("170000");

//запрос неотгруженных накладных
const $unshippedWaybills = createStore([]);
const getUnshippedWaybills = createEvent();
const fetchUnshippedWaybillsFx = createEffect(async () => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "waybill", queryParameters: { action: "unshipped" } }),
  }).then((r) => r.json());
});

$unshippedWaybills.on(fetchUnshippedWaybillsFx.doneData, (_, list) => list);
//$unshippedWaybills.watch((s) => console.log(s));

forward({
  from: getUnshippedWaybills,
  to: fetchUnshippedWaybillsFx,
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

guard({
  source: sample($f23barcode, genBarcodef23),
  filter: (barcode) => barcode.length === 0,
  target: fetchF23NumberFx,
});

sample({
  source: $index,
  clock: fetchF23NumberFx.doneData,
  fn: (index, number) => {
    console.log(number);
    let barcode = index + numMonth(new Date()) + number;
    return barcode + controlDigit(barcode);
  },
  target: $f23barcode,
});
$f23barcode.watch((s) => console.log(s));

export { showF23Dialog, $f23DialogIsActive, getUnshippedWaybills, $unshippedWaybills };
