import { createStore, createEffect, createEvent, guard, sample, forward, restore, combine } from "effector";
import connectLocalStorage from "effector-localstorage";
import { formatWaybillNum, numMonth, controlDigit, getFormatDate } from "./../../common/common";
import { $loggedUser } from "../Auth/model";

//TODO навести порядок в этой помоищще

const trackingURL = "http://10.106.0.253:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";
const today = new Date().toLocaleDateString("ru").split(".").reverse().join("-");
//const trackingURLnew = "https://tracking.russianpost.ru/hdps/v5/history/";

//**************блок для ф104
const generate = createEvent("g");
const waybillAdded = createEvent();
//зануление номера накладной после записи в бд
const resetNumWaybill = createEvent();

const $index = createStore("170000");
const $numWaybill = createStore(0);
const $f104Barcode = createStore("").reset(resetNumWaybill);

//запись накладной в бд

//запрос последней накладной, получение порядкового номера
const fetchWaybillNumberFx = createEffect("f", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "config" }),
    })
      .then((r) => r.json())
      .then(([data]) => +data.value); //TODO если не пришел номер сделать обратботку
  },
});

//barcode f104 generator
$numWaybill.on(fetchWaybillNumberFx.doneData, (_, n) => n).reset(resetNumWaybill);

forward({
  from: generate,
  to: fetchWaybillNumberFx,
});

//$numWaybill.watch((s) => console.log(s));

sample({
  source: $index,
  clock: $numWaybill,
  fn: (index, number) => {
    //console.log(number);
    let barcode = index + numMonth(new Date()) + formatWaybillNum(number);
    return barcode + controlDigit(barcode);
  },
  target: $f104Barcode,
});

//$f104Barcode.watch((s) => console.log(s));
/***************************конец блока для ф104 */

////Шапка регистрации отправления

//запись индекса приписки
const $listofDestinationIndexes = createStore([170044, 170044]); //пока Старый не сказал второй индекс, будут 2 одинаковых
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
      body: JSON.stringify({ destination: "abonbox" }),
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

//отметка дефектной ведомости
const defectCheked = createEvent();
const $defectF104 = createStore(false).on(defectCheked, (_, checked) => checked);
//$defectF104.watch((s) => console.log(s));

//показ диалогового окна с ф104
const showComponentDialog = createEvent("showComponent");
const $componentDialogIsActive = createStore(false).on(showComponentDialog, (state, _) => !state);
//номер контейнера
const enteredContainerNum = createEvent();
const $container = createStore("").on(enteredContainerNum, (_, container) => container);

//номер пломбы
const enteredStampNum = createEvent();
const $stamp = createStore("").on(enteredStampNum, (_, stamp) => stamp);
//$stamp.watch((s) => console.log(s));

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
      .then((data) => data.history[0]);
  },
});
//после ввода шк перекидываем данные в запрос на трекер
forward({
  from: enteringBarcode,
  to: fetchFromTrackingFx,
});

//запрос номера накладной
guard({
  source: sample($numWaybill, enteringBarcode),
  filter: (num) => num === 0,
  target: generate,
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
    //console.log(payload);
    return +payload.mailCtg !== 3;
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
    resultParameters.object = `&object=${payload.mailType}0${payload.mailCtg}0`;
    resultParameters.weight = `&weight=${payload.mass}`;

    if (+payload.mailType === 23 || +payload.mailType === 24) {
      resultParameters.from = `&from=${destIndex}`;
      resultParameters.to = `&to=${payload.indexTo}`;
    } else {
      resultParameters.from = `&from=${payload.indexTo}`;
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
    sumoc: `&sumoc=${payload.value.value}`,
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
    console.log(url); //включить чтобы видкть ссылку тарификатора
    return url;
  },
  target: fetchFromTarifficatorFx,
});

/***************************************************** */
//стор для защиты от ввода ШК при незаполненных индексе назначения и АЯ
const allow = createEvent("allow");
const $allowed = createStore(false).on(allow, (_, resolution) => resolution);
//$allowed.watch((s) => console.log(s));

forward({
  from: combine($destinationIndex, $selectedAbonBox, (index, abonbox) => {
    return index !== 0 && Object.keys(abonbox).length > 0;
  }),
  to: allow,
});

/****************************************
 *добавление в БД отправления
 */
//эффект для вставки
//отравляется запрос на сервер с направление crud и экшеном insert
const insertFx = createEffect("insert", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "rpo", queryParameters: { action: "INSERT", ...payload } }),
    }).then((r) => r.json());
  },
});
//формирование пакета для отправки на сервер для вставки отправления в БД
sample({
  //объединение данных о ШК, контейнере, печати и а/я
  source: combine({ $barcode, $selectedAbonBox, $numWaybill }, ({ $barcode, $selectedAbonBox, $numWaybill }) => ({
    barcode: $barcode,
    abonBoxId: $selectedAbonBox[0]?.id ?? "",
    f104id: +$numWaybill,
  })),
  clock: fetchFromTarifficatorFx.doneData,
  fn: (container, tariffData) => {
    //добавляем данные об РПО
    return {
      ...container,
      name: tariffData.name,
      typ: tariffData.typ,
      ctg: tariffData.cat,
      destinationIndex: tariffData.typ === 23 || tariffData.typ === 24 ? tariffData.to : tariffData.from,
      weight: tariffData.weight,
      sumoc: tariffData.sumoc ? tariffData.sumoc / 100 : null,
      sumCover: "0",
      shipmentMethod: 1, //tariffData.transname ?? "наземно",
      aviaTariff: "0",
      paynds: tariffData.ground.valnds,
      pay: tariffData.ground.val,
      nds: tariffData.ground.valnds - tariffData.ground.val,
      timereg: getFormatDate(),
    };
  },
  //на сервер
  target: insertFx,
});
//если не произошло добавление в бд
const notInserted = restore(
  insertFx.doneData.map((resp) => resp !== 0),
  false
);

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

//объединение данных ШК и пришедших из тарификатора(просто чтобы упростить запись)
const union = sample($barcode, fetchFromTarifficatorFx.doneData, (barcode, tariffData) => ({
  [barcode]: {
    name: tariffData.name,
    typ: tariffData.typ,
    destinationIndex: tariffData.typ === 23 || tariffData.typ === 24 ? tariffData.to : tariffData.from,
    weight: tariffData.weight,
    sumoc: tariffData.sumoc ? tariffData.sumoc / 100 : "-",
    sumCover: "нужен ли столбец?",
    shipmentMethod: "наземно", //tariffData.transname ?? "наземно",
    aviaTariff: "0",
    paynds: tariffData.ground.valnds / 100,
    pay: tariffData.ground.val / 100,
    nds: (tariffData.ground.valnds - tariffData.ground.val) / 100,
  },
}));

//добавляем новое отправление в список (только если с сервера пришел ответ о успешном insert)
guard({
  source: sample(union, insertFx.doneData),
  filter: insertFx.doneData.map((resp) => resp === 0),
  target: addNewPackage,
});

//переписать на attach
//запись накладной в бд
const addNewWaybillToDBFx = createEffect(async (payload) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "addnew", ...payload } }),
  }).then((r) => r.json());
});

//запись накладной в бд(формирование пэйлода для запроса на сервер)
sample({
  source: { $numWaybill, $f104Barcode, $selectedAbonBox, $loggedUser, $defectF104 },
  clock: waybillAdded,
  fn: ({ $numWaybill, $f104Barcode, $selectedAbonBox, $loggedUser, $defectF104 }) => {
    return {
      id: +$numWaybill,
      barcode: $f104Barcode,
      printdate: today, //.replace(/\//g, "."),
      firmid: $selectedAbonBox[0].id,
      userid: $loggedUser.userName,
      waybilltype: $defectF104 ? 5 : 6,
      f23id: 0,
    };
  },
  target: addNewWaybillToDBFx,
});

forward({
  from: addNewWaybillToDBFx.done,
  to: resetNumWaybill,
});
/****************************
 *
 */

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
  enteredContainerNum,
  $container,
  enteredStampNum,
  $stamp,
  insertFx,
  notInserted,
  defectCheked,
  $defectF104,
  showComponentDialog,
  $componentDialogIsActive,
  $f104Barcode,
  waybillAdded,
};
