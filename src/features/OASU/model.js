import { forward } from "effector";
import { createEffect, createEvent, createStore } from "effector";

const trackingURL = "http://10.106.0.253:8000/";

const getRawRPO = createEvent();
const generateFileOASU = createEvent();

//запрос количества необработанных РПО(не сформирован файл для ОАСУ РПО)
const fetchRawRPOFx = createEffect(async () => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "rpo", queryParameters: { action: "OASU" } }),
  }).then((r) => r.json());
});

//запрос на генерацию файла ф104
const generateFileOASUFx = createEffect(async (barcode) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "generator", queryParameters: { action: "oasu" } }),
  }).then((r) => r.json());
});

const $rawRPO = createStore(0).on(fetchRawRPOFx.doneData, (_, ungenList) => ungenList);

forward({
  from: generateFileOASU,
  to: generateFileOASUFx,
});

forward({
  from: getRawRPO,
  to: fetchRawRPOFx,
});

export { generateFileOASU, $rawRPO, getRawRPO };
