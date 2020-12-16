import React from "react";
import { useStore } from "effector-react";
import { F104 } from "./../F104/F104.jsx";
import { NewMassDialog } from "./../NewMassDialog";
import { HeaderRegistration, TableRegistration } from "./ui/";
import { resetPackageList, notInserted, $componentDialogIsActive, $newMassDialog } from "./model";

export const Registration = () => {
  const componentDialogIsActive = useStore($componentDialogIsActive);
  const newMassDialog = useStore($newMassDialog);
  const notInsertedFlag = useStore(notInserted);

  const clearState = () => {
    resetPackageList();
  };

  return (
    <div>
      {componentDialogIsActive ? <F104 /> : null}
      {newMassDialog ? <NewMassDialog /> : null}
      <HeaderRegistration />
      <hr />
      {notInsertedFlag ? <span style={{ color: "red" }}>РПО было приписано ранее</span> : null}
      <TableRegistration />
      <hr />
      {/* временные кнопки */}
      <button onClick={clearState}>clear</button>
    </div>
  );
};
