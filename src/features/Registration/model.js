import { createStore, createEffect, createEvent, guard, sample, forward, restore, combine, split } from "effector";
import connectLocalStorage from "effector-localstorage";
import { formatWaybillNum, numMonth, controlDigit, getFormatDate } from "./../../common/common";
import { $loggedUser } from "../Auth/model";

//TODO навести порядок в этой помоищще

const trackingURL = "http://10.106.0.253:8000/";
const tarifficatorURL = "https://tariff.pochta.ru/tariff/v1/calculate?json";
const today = new Date().toLocaleDateString("ru").split(".").reverse().join("-");
//const trackingURLnew = "https://tracking.russianpost.ru/hdps/v5/history/";

/*************************
 **
 *    Шапка регистрации отправления
 */

const selectAbonBox = createEvent("selectAbonBox");
const resetSelectedAbonBox = createEvent("resetAbonBox");
const toFetchAbonBox = createEvent("toFetchAbonBox"); //формирование списка абонентских ящиков
const defectCheked = createEvent(); //отметка дефектной ведомости
const pickDestinationIndex = createEvent("selectIndex"); //запись индекса приписки
const enteredContainerNum = createEvent();
const enteredStampNum = createEvent();
const allow = createEvent("allow");

//получение списка а/я из БД
const fetchAbonBoxListFx = createEffect("AbonBox", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "abonbox" }),
    }).then((r) => r.json());
  },
});

const $listofDestinationIndexes = createStore([170044, 170044]); //пока Старый не сказал второй индекс, будут 2 одинаковых
const $destinationIndex = restore(pickDestinationIndex, 0);
const $abonBoxList = createStore([]).on(fetchAbonBoxListFx.doneData, (_, payload) => {
  return payload;
});
const $selectedAbonBox = createStore({}).reset(resetSelectedAbonBox);
const $defectF104 = createStore(false).on(defectCheked, (_, checked) => checked);
const $container = createStore("").on(enteredContainerNum, (_, container) => container);
const $stamp = createStore("").on(enteredStampNum, (_, stamp) => stamp); //номер пломбы
const $allowed = createStore(false).on(allow, (_, resolution) => resolution); //стор для защиты от ввода ШК при незаполненных индексе назначения и АЯ
//$allowed.watch((s) => console.log(s));

forward({
  from: combine($destinationIndex, $selectedAbonBox, (index, abonbox) => {
    return index !== 0 && Object.keys(abonbox).length > 0;
  }),
  to: allow,
});

forward({
  from: toFetchAbonBox,
  to: fetchAbonBoxListFx,
});

sample({
  source: $abonBoxList,
  clock: selectAbonBox,
  fn: (list, abonBox) => list.filter((item) => item.abonentbox === abonBox),
  target: $selectedAbonBox,
});

/**
 *
 * Конец шапки
 *
 *
 */

/**
 * Блок приписки
 *
 *  */

const enteringBarcode = createEvent("barcdode"); //запрашиваемый ШК
const createURLParameters = createEvent("createURLParameters");
const transportDataToURL = createEvent();
const editMass = createEvent();
const addDeclaredValue = createEvent("addDeclaredValue"); //добавление оценочной стоимости к стору параметров(если таковая имеется)
const addCoverValue = createEvent(); //добавление наложенного платежа в УРЛ(для тарификации не используется, но НАДО )
const addNewPackage = createEvent("new package"); //добавление нового отправлния в лист
const showNewMassDialog = createEvent();
const resetPackageList = createEvent("resetPL");

//запрос данных с трекера
const fetchFromTrackingFx = createEffect("tracking", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "tracker", ...payload }),
    })
      .then((r) => r.json())
      .then((data) => data.history.filter((controlPoint) => controlPoint.operType === 1)[0]);
  },
});

//запрос данных из тарификатора
const fetchFromTarifficatorFx = createEffect("tarifficator", {
  handler: async (payload) => {
    return fetch(payload).then((r) => r.json());
  },
});

//эффект для вставки отравляется запрос на сервер с направление crud и экшеном insert
const insertFx = createEffect("insert", {
  handler: async (payload) => {
    console.log(payload);
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "rpo", queryParameters: { action: "INSERT", ...payload } }),
    }).then((r) => r.json());
  },
});

const $buffer = createStore({}).on(fetchFromTrackingFx.doneData, (_, data) => data);
const $barcode = createStore("").on(enteringBarcode, (_, payload) => payload.barcode); //баркод РПО
const $urlParameters = createStore({})
  .on(createURLParameters, (state, payload) => ({ ...state, ...payload }))
  .on(addDeclaredValue, (state, { buffer }) => ({
    ...state,
    sumoc: `&sumoc=${buffer.value.value}`,
  }))
  .on(addCoverValue, (state, { buffer }) => ({ ...state, sumin: `&sumin=${buffer.payment.value}` }))
  .reset(addNewPackage); //reset стора после записи отравления в лист
const $newMassDialog = createStore(false).on(showNewMassDialog, (s, _) => !s);
//если не произошло добавление в бд
const notInserted = restore(
  insertFx.doneData.map((resp) => resp !== 0),
  false
);
//prepared data and work with LS
const packageListLocalStorage = connectLocalStorage("packageListLS").onError((err) => console.log(err));
const $packageList = createStore(packageListLocalStorage.init({}) || {})
  .on(addNewPackage, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .on(resetPackageList, () => {
    return {}; //чот с reset не работатет :( хоть issue пиши
  });
$packageList.watch(packageListLocalStorage);

//после ввода шк перекидываем данные в запрос на трекер
forward({
  from: enteringBarcode,
  to: fetchFromTrackingFx,
});

//если установлен флаг Дефектной ф104 отлавливаем приходящие значения и должны изменить массу перед отправкой на тарификацию
split({
  source: sample($defectF104, $buffer, (defect, buffer) => ({ defect, buffer })),
  match: {
    showDialog: ({ defect }) => defect,
    transportDataToURL: ({ defect }) => !defect,
  },
  cases: {
    showDialog: showNewMassDialog,
    transportDataToURL: transportDataToURL,
  },
});

sample({
  source: $buffer,
  clock: editMass,
  fn: (buffer, newMass) => ({ buffer: { ...buffer, mass: newMass } }),
  target: transportDataToURL,
});

//добавление оценочной стоимости к стору параметров(если таковая имеется)
guard({
  source: transportDataToURL,
  filter: ({ buffer }) => {
    return +buffer.mailCtg !== 3;
  },
  target: addDeclaredValue,
});
//добавление наложенного платежа
guard({
  source: transportDataToURL,
  filter: ({ buffer }) => {
    return +buffer.mailCtg === 4;
  },
  target: addCoverValue,
});

//добавление остальных параметров в стор  для для формирования URL
sample({
  source: $destinationIndex,
  clock: transportDataToURL,
  fn: (destIndex, { buffer }) => {
    const resultParameters = {};
    resultParameters.service = buffer.postMark >= 8388608 ? `&service=28,12` : `&service=28`; //если не габаритное РПО
    resultParameters.object = `&object=${buffer.mailType}0${buffer.mailCtg}0`;
    resultParameters.weight = `&weight=${buffer.mass}`;

    if (+buffer.mailType === 23 || +buffer.mailType === 24 || +buffer.mailType === 4) {
      resultParameters.from = `&from=${destIndex}`;
      resultParameters.to = `&to=${buffer.indexTo}`;
    } else {
      resultParameters.from = `&from=${buffer.indexTo}`;
      resultParameters.to = `&to=${destIndex}`;
    }

    return resultParameters;
  },
  target: createURLParameters,
});

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

//формирование пакета для отправки на сервер для вставки отправления в БД
sample({
  //объединение данных о ШК, контейнере, печати и а/я
  source: combine({ $barcode, $selectedAbonBox, $loggedUser }, ({ $barcode, $selectedAbonBox, $loggedUser }) => ({
    barcode: $barcode,
    abonBoxId: $selectedAbonBox[0]?.id ?? "",
    userid: $loggedUser.userId,
  })),
  clock: fetchFromTarifficatorFx.done,
  fn: (container, { params, result }) => {
    //добавляем данные об РПО
    return {
      ...container,
      name: result.name,
      typ: result.typ,
      ctg: result.cat,
      destinationIndex: result.typ === 23 || result.typ === 24 ? result.to : result.from,
      weight: result.weight,
      sumoc: result.sumoc ? result.sumoc / 100 : null,
      sumCover: params.match(/(?<=sumin=)\d+/g) ? params.match(/(?<=sumin=)\d+/g)[0] / 100 : null,
      shipmentMethod: 1, //tarifficatorData.transname ?? "наземно",
      aviaTariff: "0",
      paynds: result.ground.valnds,
      pay: result.ground.val,
      nds: result.ground.valnds - result.ground.val,
      timereg: getFormatDate(),
    };
  },
  //на сервер
  target: insertFx,
});

//объединение данных ШК и пришедших из тарификатора(просто чтобы упростить запись)
const union = sample($barcode, fetchFromTarifficatorFx.done, (barcode, { params, result }) => ({
  [barcode]: {
    name: result.name,
    typ: result.typ,
    destinationIndex: result.typ === 23 || result.typ === 24 ? result.to : result.from,
    weight: result.weight,
    sumoc: result.sumoc ? result.sumoc / 100 : "-",
    sumCover: params.match(/(?<=sumin=)\d+/g) ? params.match(/(?<=sumin=)\d+/g)[0] / 100 : "-",
    shipmentMethod: "наземно", //result.transname ?? "наземно",    ** 1- наземно
    aviaTariff: "0",
    paynds: result.ground.valnds / 100,
    pay: result.ground.val / 100,
    nds: (result.ground.valnds - result.ground.val) / 100,
  },
}));

//добавляем новое отправление в список (только если с сервера пришел ответ об успешном insert)
guard({
  source: sample(union, insertFx.doneData),
  filter: insertFx.doneData.map((resp) => resp === 0),
  target: addNewPackage,
});

/**
 *
 * конец блока приписки
 *
 */

/************
 * блок для ф104
 *
 *
 *
 *
 * */
const generate = createEvent("g");
const waybillAdded = createEvent();
const resetNumWaybill = createEvent(); //зануление номера накладной после записи в бд
const showComponentDialog = createEvent("showComponent"); //показ диалогового окна с ф104

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

//запись накладной в бд
const addNewWaybillToDBFx = createEffect(async (payload) => {
  return fetch(trackingURL, {
    method: "POST",
    body: JSON.stringify({ destination: "f104", queryParameters: { action: "addnew", ...payload } }),
  }).then((r) => r.json());
});

const $index = createStore("170000");
const $numWaybill = createStore(0).on(fetchWaybillNumberFx.doneData, (_, n) => n);
const $componentDialogIsActive = createStore(false).on(showComponentDialog, (state, _) => !state);
const $f104Barcode = createStore(false).reset(resetNumWaybill);

//запрос номера накладной
forward({
  from: generate,
  to: fetchWaybillNumberFx,
});

//формирование баркода ф104
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

//показ формы ф104 после формирования баркода
guard({
  source: $f104Barcode,
  filter: (barcode) => barcode,
  target: showComponentDialog,
});

//запись накладной в бд(формирование пэйлода для запроса на сервер)
sample({
  source: { $numWaybill, $f104Barcode, $selectedAbonBox, $loggedUser, $defectF104, $container, $stamp },
  clock: waybillAdded,
  fn: ({ $numWaybill, $f104Barcode, $selectedAbonBox, $loggedUser, $defectF104, $container, $stamp }) => {
    return {
      id: +$numWaybill,
      barcode: $f104Barcode,
      printdate: today, //.replace(/\//g, "."),
      containernum: $container,
      stampnum: $stamp,
      firmid: $selectedAbonBox[0].id,
      userid: $loggedUser.userId,
      waybilltypeid: $defectF104 ? 5 : 6,
      f23id: 0,
    };
  },
  target: addNewWaybillToDBFx,
});

//сброс баркода
forward({
  from: addNewWaybillToDBFx.done,
  to: resetNumWaybill,
});

/**
 *
 *
 * конец блока для ф104
 *  */

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
  generate,
  showComponentDialog,
  $componentDialogIsActive,
  $f104Barcode,
  waybillAdded,
  $newMassDialog,
  showNewMassDialog,
  editMass,
};
