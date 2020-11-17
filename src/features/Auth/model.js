import { createEffect, createEvent, forward, guard, sample, restore } from "effector";
const trackingURL = "http://10.106.0.253:8000/";

//просто логаут
const logOut = createEvent("logOut");
//если в ЛС нетэюзера
const setNewLoggedUser = createEvent("set new user");
//если нашли юзера в ЛС
const setStoredLoggedUser = createEvent("restore user from localStorage");

const $loggedUser = restore(setStoredLoggedUser, false).reset(logOut);
//проверка ЛС на наличие юзера
const checkStoredUserFx = createEffect("storedUser", {
  handler: () => {
    return { userName: localStorage.getItem("userName"), isAdmin: localStorage.getItem("isAdmin") };
  },
});

const isLogged = $loggedUser.map((user) => !user?.userName);
//если есть в ЛС
guard({
  source: checkStoredUserFx.doneData,
  filter: isLogged,
  target: setStoredLoggedUser,
});

const fetchUserIDFx = createEffect("fetchUserId", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "users", queryParameters: { id: payload } }),
    }).then((r) => r.json());
  },
});

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
  fn: (data) => ({ userName: data[0].name, isAdmin: data[0].isadmin }),
  target: $loggedUser,
});

//смотрим за стором и записываем в локалсторадж имя юзера
$loggedUser.watch((s) => {
  if (s) {
    localStorage.setItem("userName", s.userName);
    localStorage.setItem("isAdmin", s.isAdmin);
  }
});

export { $loggedUser, setNewLoggedUser, checkStoredUserFx, logOut };
