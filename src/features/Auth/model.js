import { createStore, createEffect, createEvent, forward, guard, sample } from "effector";
const trackingURL = "http://10.106.13.10:8000/";

const setLoggedUser = createEvent();
const fetchUserIDFx = createEffect("fetchUserId", {
  handler: async (payload) => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "db", queryParameters: { table: "users", id: payload } }),
    }).then((r) => r.json());
  },
});
const $loggedUser = createStore(null);

forward({
  from: setLoggedUser,
  to: fetchUserIDFx,
});

sample({
  source: guard({
    source: fetchUserIDFx.doneData,
    filter: (data) => data.length > 0,
  }),
  fn: (data) => data[0].name,
  target: $loggedUser,
});

$loggedUser.watch((s) => console.log(s));

export { $loggedUser, setLoggedUser };
