import cl from "./StampBlanc.module.css";
const StampBlanc = () => {
  return (
    <div className={cl.stamp}>
      <div className={cl.blankStamp}></div>
      <div className={cl.stampDescription}>(Оттиск календарного почтового штемпеля места отправления)</div>
    </div>
  );
};
export { StampBlanc };
