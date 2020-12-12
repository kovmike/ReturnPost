import { useEffect } from "react";
import { useStore } from "effector-react";
import { generateFileOASU, $rawRPO, getRawRPO } from "./model";

export const OASU = () => {
  const count = useStore($rawRPO);

  useEffect(() => {
    getRawRPO();
  }, []);

  return (
    <div>
      <h4>Отправлений не включенных в файл для ОАСУ РПО : {count}</h4>
      <button onClick={generateFileOASU}>Сформировать файл</button>
    </div>
  );
};
