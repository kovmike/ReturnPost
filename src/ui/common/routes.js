import React from "react";
import { Registration } from "./../../features/Registration/Registration.jsx";
import { Waybills } from "./../../features/Waybills";
import { Shipment } from "./../../features/Shipment";
import { Reports } from "./../../features/Reports";
import { OASU } from "./../../features/OASU";

export const routes = [
  { path: "/registration", exact: true, component: <Registration /> },
  { path: "/waybills", exact: true, component: <Waybills /> },
  { path: "/shipment", exact: true, component: <Shipment /> },
  { path: "/reports", exact: true, component: <Reports /> },
  { path: "/oasu", exact: true, component: <OASU /> },
];

//старый вариант
// export const routes = [
//   { path: "/registration", exact: true, component: () => <Registration /> },
//   { path: "/waybills", exact: true, component: () => <Waybills /> },
//   { path: "/shipment", exact: true, component: () => <Shipment /> },
//   { path: "/reports", exact: true, component: () => <Reports /> },
// ];
