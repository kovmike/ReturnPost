import { DivUnderLinedLong, Label } from "../../atoms";
import cl from "./FromTo.module.css";

const FromTo = () => {
  return (
    <div className={cl.fromToWrapper}>
      <Label text={"Накладная №"} />
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
