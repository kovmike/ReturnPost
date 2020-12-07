import { forward } from "effector";
import { createEffect, createEvent, createStore } from "effector";

const trackingURL = "http://10.106.0.253:8000/";

const getNotGenF104 = createEvent();
const generateFile = createEvent();

const fetchNotGeneratedF104Fx = createEffect(async () => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "ungenerated" } }),
  }).then((r) => r.json());
});

const $ungeneratedF104 = createStore([]).on(fetchNotGeneratedF104Fx.doneData, (_, ungenList) => ungenList);

//запрос на генерацию файла ф104
const generateFileFx = createEffect(async (barcode) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "generator", queryParameters: { barcode } }),
  }).then((r) => r.json());
});

forward({
  from: generateFile,
  to: generateFileFx,
});

forward({
  from: getNotGenF104,
  to: fetchNotGeneratedF104Fx,
});

export { generateFile, $ungeneratedF104, getNotGenF104 };
