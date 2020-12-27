import React from "react";
import { useStore } from "effector-react";
import { F104 } from "./../F104/F104.jsx";
import { NewMassDialog } from "./../NewMassDialog";
import { HeaderRegistration, TableRegistration } from "./ui/";
import {
  resetPackageList,
  notInserted,
  $componentDialogIsActive,
  $newMassDialog,
  showComponentDialog,
  $selectedAbonBox,
  $packageList,
  $stamp,
  $container,
  $f104Barcode,
  waybillAdded,
  $defectF104,
} from "./model";
import { $loggedUser } from "./../Auth";

export const Registration = () => {
  const componentDialogIsActive = useStore($componentDialogIsActive);
  const newMassDialog = useStore($newMassDialog);
  const notInsertedFlag = useStore(notInserted);
  const selectedAbonBox = useStore($selectedAbonBox);
  const packageList = useStore($packageList);
  const loggedUser = useStore($loggedUser);
  const f104Barcode = useStore($f104Barcode);
  const container = useStore($container);
  const stamp = useStore($stamp);
  const defect = useStore($defectF104);

  const clearState = () => {
    resetPackageList();
  };

  return (
    <div>
      {componentDialogIsActive ? (
        <F104
          selectedAbonBox={selectedAbonBox}
          packageList={packageList}
          user={loggedUser.userName}
          f104Barcode={f104Barcode}
          container={container}
          stamp={stamp}
          defect={defect}
          waybillAdded={waybillAdded}
          showComponentDialog={showComponentDialog}
          resetPackageList={resetPackageList}
        />
      ) : null}
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
