import { createStore, createEffect, createEvent, guard, sample, forward, restore, combine } from "effector";
import connectLocalStorage from "effector-localstorage";
//import { $selectedAbonBox, $destinationIndex } from "./../../index.js";
const trackingURL = "http://10.106.13.10:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";

////Шапка регистрации отправления

//запись индекса приписки
const $listofDestinationIndexes = createStore([170044, 170963]); //пока Старый не сказал второй индекс, будут 2 одинаковых
const pickDestinationIndex = createEvent("selectIndex");
const $destinationIndex = restore(pickDestinationIndex, 0);
//$destinationIndex.watch((s) => console.log(s));

//формирование списка абонентских ящиков
const toFetchAbonBox = createEvent("toFetchAbonBox");
//получение списка а/я из БД
const fetchAbonBoxListFx = createEffect("AbonBox", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "db", queryParameters: { table: "firms" } }),
    }).then((r) => r.json());
  },
});

forward({
  from: toFetchAbonBox,
  to: fetchAbonBoxListFx,
});

const $abonBoxList = createStore([]).on(fetchAbonBoxListFx.doneData, (_, payload) => {
  return payload;
});
//$abonBoxList.watch((s) => console.log(s));

//запись выбранного а/я
const selectAbonBox = createEvent("selectAbonBox");
const resetSelectedAbonBox = createEvent("resetAbonBox");
const $selectedAbonBox = createStore({}).reset(resetSelectedAbonBox);
//$selectedAbonBox.watch((s) => console.log(s));

sample({
  source: $abonBoxList,
  clock: selectAbonBox,
  fn: (list, abonBox) => list.filter((item) => item.abonentbox === abonBox),
  target: $selectedAbonBox,
});

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

//prepared data and work with LS
const packageListLocalStorage = connectLocalStorage("packageListLS").onError((err) => console.log(err));
const resetPackageList = createEvent("resetPL");
const $packageList = createStore(packageListLocalStorage.init({}) || {})
  .on(addNewPackage, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .on(resetPackageList, () => {
    return {}; //чот с reset не работатет :( хоть issue пиши
  });
$packageList.watch(packageListLocalStorage);

//добавляем новое отправление в список
sample({
  source: $barcode,
  clock: fetchFromTarifficatorFx.doneData,
  fn: (barcode, tariffData) => {
    return {
      [barcode]: {
        name: tariffData.name,
        typ: tariffData.typ,
        destinationIndex: tariffData.typ === 23 || tariffData.typ === 24 ? tariffData.to : tariffData.from,
        weight: tariffData.weight,
        sumoc: tariffData.sumoc / 100,
        sumCover: "0",
        shipmentMethod: tariffData.transname ?? "наземно",
        aviaTariff: "0",
        paynds: tariffData.paynds / 100,
        pay: tariffData.pay / 100,
        nds: tariffData.nds / 100,
      },
    };
  },
  target: addNewPackage,
});

/***************************************************** */
//стор для защиты от ввода ШК при незаполненных индексе назначения и АЯ
const allow = createEvent("allow");
const $allowed = createStore(false).on(allow, (_, resolution) => resolution);

forward({
  from: combine($destinationIndex, $selectedAbonBox, (index, abonbox) => {
    return index !== 0 && Object.keys(abonbox).length > 0;
  }),
  to: allow,
});

export {
  $packageList,
  enteringBarcode,
  $listofDestinationIndexes,
  pickDestinationIndex,
  $destinationIndex,
  $abonBoxList,
  toFetchAbonBox,
  $selectedAbonBox,
  selectAbonBox,
  resetSelectedAbonBox,
  resetPackageList,
  $allowed,
};
