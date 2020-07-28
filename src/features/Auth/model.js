import { createEffect, createEvent, forward, guard, sample, restore } from "effector";
const trackingURL = "http://10.106.13.10:8000/";

//просто логаут
const logOut = createEvent("logOut");
//если в ЛС нетэюзера
const setNewLoggedUser = createEvent("set new user");
//если нашли юзера в ЛС
const setStoredLoggedUser = createEvent("restore user from localStorage");

//проверка ЛС на наличие юзера
const checkStoredUserFx = createEffect("storedUser", {
  handler: () => {
    return localStorage.getItem("user");
  },
});
guard({
  source: checkStoredUserFx.doneData,
  filter: (user) => user,
  target: setStoredLoggedUser,
});

const fetchUserIDFx = createEffect("fetchUserId", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "db", queryParameters: { table: "users", id: payload } }),
    }).then((r) => r.json());
  },
});
const $loggedUser = restore(setStoredLoggedUser, false).reset(logOut);

//вход по новым пользователем
// setLoggedUser запускает fetchUserIDFx с введенными данными
forward({
  from: setNewLoggedUser,
  to: fetchUserIDFx,
});

//проверяем ответ, если с сервера пришел юзер, то отправляем эти данные в стор $loggedUser
sample({
  source: guard({
    source: fetchUserIDFx.doneData,
    filter: (data) => data.length > 0,
  }),
  fn: (data) => data[0].name,
  target: $loggedUser,
});

//смотрим за стором и записываем в локалсторадж имя юзера
$loggedUser.watch((s) => {
  if (s) localStorage.setItem("user", s);
});

export { $loggedUser, setNewLoggedUser, checkStoredUserFx, logOut };
