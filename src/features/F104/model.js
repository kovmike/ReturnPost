import { createEffect, createEvent, sample, createStore, forward, guard } from "effector";

import { formatWaybillNum, numMonth, controlDigit } from "./lib/common";
//import { $destinationIndex } from "./../Registration/model";
const trackingURL = "http://10.106.0.253:8000/";

const $index = createStore("170000");
const $numWaybill = createStore(0);
const $f104Barcode = createStore("");

const generate = createEvent("g");

//запрос последней накладной, получение порядкового номера
const fetchWaybillNumberFx = createEffect("f", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "db", queryParameters: { table: "waybills" } }),
    })
      .then((r) => r.json())
      .then(([data]) => formatWaybillNum(+data.id + 1));
  },
});

//barcode f104 generator
$numWaybill.on(fetchWaybillNumberFx.doneData, (_, n) => n);

guard({
  source: sample({ source: $numWaybill, clock: generate }),
  filter: (num) => num === 0,
  target: fetchWaybillNumberFx,
});
//$numWaybill.watch((s) => console.log(s));

sample({
  source: $index,
  clock: $numWaybill,
  fn: (index, number) => {
    let barcode = index + numMonth(new Date()) + number;
    return barcode + controlDigit(barcode);
  },
  target: $f104Barcode,
});

//$f104Barcode.watch((s) => console.log(s));
export { $f104Barcode, generate, $numWaybill };
