import { createEffect, createEvent, sample, createStore, forward } from "effector";
import { formatWaybillNum, numMonth, controlDigit } from "./lib/common";

//import { $destinationIndex } from "./../Registration/model";
const trackingURL = "http://10.106.0.253:8000/";

const generate = createEvent("g");
const waybillAdded = createEvent();
//зануление номера накладной после записи в бд
const resetNumWaybill = createEvent();

const $index = createStore("170000");
const $numWaybill = createStore(0);
const $f104Barcode = createStore("").reset(resetNumWaybill);

//запись накладной в бд

//запрос последней накладной, получение порядкового номера
const fetchWaybillNumberFx = createEffect("f", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "waybill", queryParameters: { action: "getlast" } }),
    })
      .then((r) => r.json())
      .then(([data]) => formatWaybillNum(+data.id + 1)); //TODO если не пришел номер сделать обратботку
  },
});

//barcode f104 generator
$numWaybill.on(fetchWaybillNumberFx.doneData, (_, n) => n).reset(resetNumWaybill);

forward({
  from: generate,
  to: fetchWaybillNumberFx,
});

$numWaybill.watch((s) => console.log(s));

sample({
  source: $index,
  clock: $numWaybill,
  fn: (index, number) => {
    console.log(number);
    let barcode = index + numMonth(new Date()) + number;
    return barcode + controlDigit(barcode);
  },
  target: $f104Barcode,
});
//запись накладной в бд $selectedAbonBox,

//$f104Barcode.watch((s) => console.log(s));
export { $f104Barcode, generate, $numWaybill, waybillAdded, resetNumWaybill };
