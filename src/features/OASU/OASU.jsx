import { useEffect } from "react";
import { useStore } from "effector-react";
import { generateFileOASU, $rawRPO, getRawRPO } from "./model";

export const OASU = () => {
  const count = useStore($rawRPO);

  useEffect(() => {
    getRawRPO();
  }, [count]);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={generateFileOASU}>Сформировать файл</button>
    </div>
  );
};
