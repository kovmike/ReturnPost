import { Registration } from "./../../features/Registration";
import { Waybills } from "./../../features/Waybills";
import { Shipment } from "./../../features/Shipment";
import { Reports } from "./../../features/Reports";

export const routes = [
  { path: "/", exact: true, component: Registration },
  { path: "/waybills", exact: true, component: Waybills },
  { path: "/shipment", exact: true, component: Shipment },
  { path: "/reports", exact: true, component: Reports },
];
