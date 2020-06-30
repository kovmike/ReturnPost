import { createStore, createEffect, forward } from "effector";
const trackingURL = "http://127.0.0.1:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";

const rest = "object=23020&from=170044&to=111538&weight=441&closed=1&sumoc=10000&sumin=100000&sum_month=100000000&date=20200630";

const fetchFromTrackingFx = createEffect("tracking", {
  handler: async (payload) => {
    console.log("tracking");
    return fetch(trackingURL, { method: "POST", body: JSON.stringify(payload) })
      .then((r) => r.json())
      .then((data) => JSON.stringify(data[0]));
  },
});
const fetchFromTarifficatorFx = createEffect("tarifficator", {
  handler: async (payloadtest) => {
    const payload = JSON.parse(payloadtest);
    const object = "&object=" + payload.ItemParameters.MailType.Id + "0" + payload.ItemParameters.MailCtg.Id + "0";
    const from = "&from=" + payload.AddressParameters.OperationAddress.Index;
    const to = "&to=" + payload.AddressParameters.DestinationAddress.Index;
    const weight = "&weight=" + payload.ItemParameters.Mass;
    const sumoc = "&sumoc=" + payload.FinanceParameters.Value * 100;
    const completeURL = tarifficatorURL.concat(object, from, to, weight, sumoc);
    //object=23020&from=170044&to=111538&weight=441&sumoc=10000

    return fetch(completeURL)
      .then((r) => r.json())
      .then((data) => JSON.stringify(data));
  },
});
forward({
  from: fetchFromTrackingFx.doneData,
  to: fetchFromTarifficatorFx,
});

const $fromTracking = createStore({}).on(fetchFromTarifficatorFx.doneData, (_, payload) => JSON.parse(payload).paynds);

export { $fromTracking, fetchFromTrackingFx };
