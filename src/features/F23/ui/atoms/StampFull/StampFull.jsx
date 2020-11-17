import cl from "./StampFull.module.css";
const StampFull = () => {
  const nowDate = () => {
    const now = new Date();
    return now.toLocaleDateString("ru").split("-").reverse().join(".") + "г.";
  };
  const nowTime = () => {
    const now = new Date();
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    return now.toLocaleDateString("ru", options).split(" ")[1];
  };
  return (
    <div className={cl.stamp}>
      <div className={cl.blankStamp}>
        <div style={{ fontSize: "12px" }}>{nowDate()}</div>
        <div style={{ fontSize: "12px" }}>{nowTime()}</div>
        <div style={{ fontSize: "18px", fontWeight: "700" }}>170000</div>
        <div style={{ fontSize: "14px" }}>почтамт</div>
        <div style={{ fontSize: "18px", fontWeight: "700" }}>ТВЕРЬ</div>
      </div>
      <div className={cl.stampDescription}>(Дата и место составления)</div>
    </div>
  );
};
export { StampFull };
