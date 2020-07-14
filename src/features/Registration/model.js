import {
  createStore,
  createEffect,
  createEvent,
  guard,
  sample,
  forward,
} from "effector";
const trackingURL = "http://127.0.0.1:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";

//формирование списка абонентских ящиков
const toFetchAbonBox = createEvent("toFetchAbonBox");

const fetchAbonBoxListFx = createEffect("AbonBox", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "db", queryString: payload }),
    }).then((r) => r.json());
    //.then((d) => JSON.stringify(d));
  },
});

forward({
  from: toFetchAbonBox,
  to: fetchAbonBoxListFx,
});

const $abonBoxList = createStore([]).on(
  fetchAbonBoxListFx.doneData,
  (_, payload) => {
    return payload;
  }
);
$abonBoxList.watch((s) => console.log(s));

// const rest =
//   "https://tariff.pochta.ru/tariff/v1/calculate?jsonobject=23020&from=170044&to=111538&weight=441&closed=1&sumoc=10000&sumin=100000&sum_month=100000000&date=20200630";
//p
const enteringBarcode = createEvent("barcdode");
const $barcode = createStore("").on(
  enteringBarcode,
  (_, payload) => payload.barcode
);
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
    console.log(payload);
    return +payload.ItemParameters.MailCtg.Id !== 3;
  },
  target: addDeclaredValue,
});

//добавление остальных параметров в стор  для для формирования URL
const createURLParameters = createEvent("createURLParameters");
sample({
  source: {}, //здесь будет стор постоянного индекса(пока хард код 170044)!!!!!!!!!!!!!!!!!!!!!
  clock: fetchFromTrackingFx.doneData,
  fn: (_, payload) => {
    const resultParameters = {};
    resultParameters.object = `&object=${payload.ItemParameters.MailType.Id}0${payload.ItemParameters.MailCtg.Id}0`;
    resultParameters.weight = `&weight=${payload.ItemParameters.Mass}`;

    if (
      +payload.ItemParameters.MailType.Id === 23 ||
      +payload.ItemParameters.MailType.Id === 24
    ) {
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
        paynds: tariffData.paynds / 100,
        weight: tariffData.weight,
      },
    };
  },
  target: addNewPackage,
});

/***************************************************** */
export { $packageList, enteringBarcode, toFetchAbonBox, $abonBoxList };
