import { DivUnderLinedLong, Label } from "../../atoms";
import cl from "./FromTo.module.css";

const FromTo = ({ barcode }) => {
  return (
    <div className={cl.fromToWrapper}>
      <Label text={`Накладная № ${barcode}`} />
      <div className={cl.fromToLine}>
        <Label text={"Из"} size={"16"} />
        <DivUnderLinedLong text={"ПОЧТАМТ 170000 ТВЕРЬ"} />
      </div>
      <div className={cl.fromToLine}>
        <Label text={"Куда"} size={"16"} />
        <DivUnderLinedLong text={""} />
      </div>
      <div className={cl.fromToLine}>
        <Label text={"Номер пломбы "} size={"16"} />
        <DivUnderLinedLong text={""} />
      </div>
    </div>
  );
};

export { FromTo };
