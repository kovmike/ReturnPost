import { createStore, createEffect, createEvent, guard, sample, forward } from "effector";
import { $selectedAbonBox, $destinationIndex } from "./../../index.js";
const trackingURL = "http://10.106.13.10:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";

//запрашиваемый ШК
const enteringBarcode = createEvent("barcdode");
const $barcode = createStore("").on(enteringBarcode, (_, payload) => payload.barcode);
//$barcode.watch((s) => console.log("barcode: " + s));

//запрос данных с трекера
const fetchFromTrackingFx = createEffect("tracking", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "tracker", ...payload }),
      mode: "cors",
    })
      .then((r) => r.json())
      .then((data) => data[0]);
  },
});
//после ввода шк перекидываем данные в запрос на трекер
forward({
  from: enteringBarcode,
  to: fetchFromTrackingFx,
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
    return +payload.ItemParameters.MailCtg.Id !== 3;
  },
  target: addDeclaredValue,
});

//добавление остальных параметров в стор  для для формирования URL
const createURLParameters = createEvent("createURLParameters");
sample({
  source: $destinationIndex,
  clock: fetchFromTrackingFx.doneData,
  fn: (destIndex, payload) => {
    const resultParameters = {};
    resultParameters.object = `&object=${payload.ItemParameters.MailType.Id}0${payload.ItemParameters.MailCtg.Id}0`;
    resultParameters.weight = `&weight=${payload.ItemParameters.Mass}`;

    if (+payload.ItemParameters.MailType.Id === 23 || +payload.ItemParameters.MailType.Id === 24) {
      resultParameters.from = `&from=${destIndex}`;
      resultParameters.to = `&to=${payload.AddressParameters.DestinationAddress.Index}`;
    } else {
      resultParameters.from = `&from=${payload.AddressParameters.DestinationAddress.Index}`;
      resultParameters.to = `&to=${destIndex}`;
    }

    return resultParameters;
  },
  target: createURLParameters,
});

const addNewPackage = createEvent("new package"); //добавление нового отправлния в лист

const $urlParameters = createStore({})
  .on(createURLParameters, (state, payload) => ({ ...state, ...payload }))
  .on(addDeclaredValue, (state, payload) => ({
    ...state,
    sumoc: `&sumoc=${payload.FinanceParameters.Value}`,
  }))
  .reset(addNewPackage); //reset стора после записи отравления в лист
//$urlParameters.watch((s) => console.log(s));

//после заполнения стора с параметрами собираем url и передаем в эффект, который запрашивает данные из тарификатора
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

const $packageList = createStore({}).on(addNewPackage, (state, payload) => ({
  ...state,
  ...payload,
}));
//$packageList.watch((s) => console.log(s));

//добавляем новое отправление в список
sample({
  source: $barcode,
  clock: fetchFromTarifficatorFx.doneData,
  fn: (barcode, tariffData) => {
    console.log(tariffData);
    return {
      [barcode]: {
        name: tariffData.name,
        destinationIndex: tariffData.to,
        weight: tariffData.weight,
        sumoc: tariffData.sumoc / 100,
        sumCover: "0",
        shipmentMethod: tariffData.transname,
        aviaTariff: "0",
        paynds: tariffData.paynds / 100,
      },
    };
  },
  target: addNewPackage,
});

/***************************************************** */
export { $packageList, enteringBarcode };
