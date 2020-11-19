import { createEffect, forward, fromObservable } from "effector";
import { createEvent, createStore } from "effector";

const trackingURL = "http://10.106.0.253:8000/";

//показ диалога ф23
const showF23Dialog = createEvent("showComponent");
const $f23DialogIsActive = createStore(false).on(showF23Dialog, (state, _) => !state);

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
$unshippedWaybills.watch((s) => console.log(s));

forward({
  from: getUnshippedWaybills,
  to: fetchUnshippedWaybillsFx,
});

//lfkmi

export { showF23Dialog, $f23DialogIsActive, getUnshippedWaybills, $unshippedWaybills };
