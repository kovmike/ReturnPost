import { StampBlanc, Label, DivUnderLinedLong, DivUnderLined } from "../../atoms";
import cl from "./Summary.module.css";
// import {Stamp}

const Summary = ({ totalRpo }) => {
  return (
    <div className={cl.summaryWrapper}>
      <div className={cl.text}>
        <div className={cl.summaryLine}>
          <Label text={"Итого емкостей"} size={"16"} />
          <DivUnderLinedLong text={"1"} />
        </div>
        <div className={cl.summaryLine}>
          <Label text={"Отправлений"} size={"16"} />
          <DivUnderLinedLong text={totalRpo} />
        </div>
        <div className={cl.summaryLine}>
          <Label text={"Составил"} size={"16"} />
          <div className={cl.withDescription}>
            <DivUnderLined text={""} />
            <div className={cl.description}>(должность, подпись)</div>
          </div>

          <Label text={"Принял"} size={"16"} />
          <div className={cl.withDescription}>
            <DivUnderLined text={""} />
            <div className={cl.description}>(должность, подпись)</div>
          </div>
        </div>
      </div>
      <StampBlanc />
    </div>
  );
};

export { Summary };
