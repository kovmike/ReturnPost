import { forward } from "effector";
import { createEffect, createEvent, createStore } from "effector";

const trackingURL = "http://10.106.0.253:8000/";

const generateFile = createEvent();

const $ungeneratedF104 = createStore([]);

const fetchNotGeneratedF104Fx = createEffect(async () => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "ungenerated" } }),
  }).then((r) => r.json());
});
//запрос на генерацию файла ф104
const generateFileFx = createEffect(async () => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "generator", queryParameters: { barcode: "1700005340000178" } }),
  }).then((r) => r.json());
});

forward({
  from: generateFile,
  to: generateFileFx,
});

export { generateFile };
