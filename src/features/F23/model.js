import { createEffect } from "effector";
import { formatWaybillNum, numMonth, controlDigit } from "./lib/common";
const trackingURL = "http://10.106.0.253:8000/";

//dry вынести эффект в общую модель
const fetchWaybillNumberFx = createEffect("f", {
  handler: async () => {
    return fetch(trackingURL, {
      method: "POST",
      body: JSON.stringify({ destination: "config" }),
    })
      .then((r) => r.json())
      .then(([data]) => formatWaybillNum(+data.value)); //TODO если не пришел номер сделать обратботку
  },
});
