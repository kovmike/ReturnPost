import React from "react";
import { useStore } from "effector-react";
import { F104 } from "./../F104/F104.jsx";
import { HeaderRegistration, TableRegistration } from "./ui/";
import { resetPackageList, notInserted, $componentDialogIsActive } from "./model";

export const Registration = () => {
  const componentDialogIsActive = useStore($componentDialogIsActive);
  const notInsertedFlag = useStore(notInserted);

  const clearState = () => {
    resetPackageList();
  };

  const insert = async () => {};

  return (
    <div>
      {componentDialogIsActive ? <F104 /> : null}
      <HeaderRegistration />
      <hr />
      {notInsertedFlag ? <span style={{ color: "red" }}>РПО было приписано ранее</span> : null}
      <TableRegistration />
      <hr />
      {/* временные кнопки */}
      <button onClick={clearState}>clear</button>
      <button onClick={insert}>insert</button>
    </div>
  );
};
