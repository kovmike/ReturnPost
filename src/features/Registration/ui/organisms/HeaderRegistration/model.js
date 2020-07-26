import { createStore, createEvent, restore, createEffect, forward, sample } from "effector";

const trackingURL = "http://10.106.13.10:8000/";

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

export {
  $listofDestinationIndexes,
  pickDestinationIndex,
  $destinationIndex,
  $abonBoxList,
  toFetchAbonBox,
  $selectedAbonBox,
  selectAbonBox,
  resetSelectedAbonBox,
};
