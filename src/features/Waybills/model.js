import { createStore, createEffect, createEvent, sample } from "effector";

const trackingURL = "http://10.106.0.253:8000/";

const $waybillList = createStore([]);
const $startPeriod = createStore("");
const $endPeriod = createStore("");
const $rpo = createStore("");
const $waybillBarcode = createStore("");

const search = createEvent();

const fetchListWaybillFx = createEffect(async (what) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "waybill" }),
  }).then((r) => r.json());
});
