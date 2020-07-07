import { createStore, createEffect, createEvent, forward, guard, sample } from "effector";
const trackingURL = "http://127.0.0.1:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";

// const rest =
//   "https://tariff.pochta.ru/tariff/v1/calculate?jsonobject=23020&from=170044&to=111538&weight=441&closed=1&sumoc=10000&sumin=100000&sum_month=100000000&date=20200630";
const enteringBarcode = createEvent("barcdode");
const $barcode = createStore("").on(enteringBarcode, (_, payload) => payload);
//$barcode.watch((s) => console.log("barcode: " + s));

//запрос данных с трекера
const fetchFromTrackingFx = createEffect("tracking", {
  handler: async (payload) => {
    return fetch(trackingURL, { method: "POST", body: JSON.stringify(payload) })
      .then((r) => r.json())
      .then((data) => data[0]);
  },
});
//запрос данных из тарификатора
const fetchFromTarifficatorFx = createEffect("tarifficator", {
  handler: async (payload) => {
    return fetch(payload).then((r) => r.json());
  },
});

//добавление оценочной стоимости к стору параметров(если таковая имеется)
const addDeclaredValue = createEvent("addDeclaredValue");
guard({
  source: fetchFromTrackingFx.doneData,
  filter: (payload) => {
    console.log(payload.ItemParameters.MailType.Id);
    return payload.ItemParameters.MailCtg.Id !== 3;
  },
  target: addDeclaredValue,
});

//добавление остальных параметров в стор  для для формирования URL
const createURLParameters = createEvent("createURLParameters");
sample({
  source: {},
  clock: fetchFromTrackingFx.doneData,
  fn: (_, payload) => {
    const resultParameters = {};
    resultParameters.object = `&object=${payload.ItemParameters.MailType.Id}0${payload.ItemParameters.MailCtg.Id}0`;
    resultParameters.weight = `&weight=${payload.ItemParameters.Mass}`;

    if (+payload.ItemParameters.MailType.Id === 23 || +payload.ItemParameters.MailType.Id === 24) {
      resultParameters.from = `&from=170044`;
      resultParameters.to = `&to=${payload.AddressParameters.DestinationAddress.Index}`;
    } else {
      resultParameters.from = `&from=${payload.AddressParameters.DestinationAddress.Index}`;
      resultParameters.to = `&to=170044`;
    }

    return resultParameters;
  },
  target: createURLParameters,
});
//добавление остальных параметров в стор  для простых отправлений(синхронный эффект)
// const urlSimpleCreationFx = createEffect("createSimpleURL", {
//   handler: (payload) => {
//     return {
//       object: `&object=${payload.ItemParameters.MailType.Id}0${payload.ItemParameters.MailCtg.Id}0`,
//       from: `&from=${payload.AddressParameters.DestinationAddress.Index}`,
//       // to: `&to=${payload.AddressParameters.DestinationAddress.Index}`,
//       to: `&to=170044`,
//       weight: `&weight=${payload.ItemParameters.Mass}`,
//     };
//   },
// });
// //добавление остальных параметров в стор  для on-line отправлений(синхронный эффект)
// const urlOnLineCreationFx = createEffect("createOnLineURL", {
//   handler: (payload) => {
//     return {
//       object: `&object=${payload.ItemParameters.MailType.Id}0${payload.ItemParameters.MailCtg.Id}0`,
//       from: `&from=${payload.AddressParameters.OperationAddress.Index}`,
//       to: `&to=${payload.AddressParameters.DestinationAddress.Index}`,
//       weight: `&weight=${payload.ItemParameters.Mass}`,
//     };
//   },
// });

// forward({
//   from: fetchFromTrackingFx.doneData,
//   to: urlSimpleCreationFx,
// });

const $urlParameters = createStore({})
  // .on(urlSimpleCreationFx.doneData, (state, payload) => ({ ...state, ...payload }))
  // .on(urlOnLineCreationFx.doneData, (state, payload) => ({ ...state, ...payload }))
  .on(createURLParameters, (state, payload) => ({ ...state, ...payload }))
  .on(addDeclaredValue, (state, payload) => ({ ...state, sumoc: `&sumoc=${payload.FinanceParameters.Value}` }));
//$urlParameters.watch((s) => console.log(s));
/***********************************************************ДОСЮДОВА ХЕРНЯ */
//после заполнения стора параметров собираем url и передаем в эффект, который запрашивает данные из тарификатора
sample({
  source: $urlParameters,
  clock: createURLParameters,
  fn: (urlParameters, _) => {
    let url = tarifficatorURL;
    for (let param in urlParameters) {
      url += urlParameters[param];
    }
    console.log(url);
    return url;
  },
  target: fetchFromTarifficatorFx,
});
//const $fromTracking = createStore({}).on(fetchFromTarifficatorFx.doneData, (_, payload) => payload.paynds / 100);

const addNewPackage = createEvent("new package");
const $packageList = createStore({}).on(addNewPackage, (state, payload) => ({ ...state, ...payload }));
//$packageList.watch((s) => console.log(s));

//добавляем новое отправление в список
sample({
  source: $barcode,
  clock: fetchFromTarifficatorFx.doneData,
  fn: (barcode, tariffData) => {
    return { [barcode]: { name: tariffData.name, paynds: tariffData.paynds / 100 } };
  },
  target: addNewPackage,
});

/***************************************************** */
export { fetchFromTrackingFx, $packageList, enteringBarcode };
