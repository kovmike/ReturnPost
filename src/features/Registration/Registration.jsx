import React from "react";
import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { F104 } from "./../F104";
import { HeaderRegistration } from "./ui/organisms/HeaderRegistration";
import { TableRegistration } from "./ui/organisms/TableRegistration";
import { resetPackageList } from "./model";

//Component dialog state
/**
 * убрать отсюда создание юнитов в модель
 */
export const showComponentDialog = createEvent("showComponent");
const $componentDialogIsActive = createStore(false).on(showComponentDialog, (state, _) => !state);
//$componentDialogIsActive.watch((s) => console.log(s));

export const Registration = () => {
  const componentDialogIsActive = useStore($componentDialogIsActive);

  const showF104 = () => {
    showComponentDialog();
  };
  const clearState = () => {
    resetPackageList();
  };
  return (
    <div>
      {componentDialogIsActive ? <F104 /> : null}
      <HeaderRegistration />
      <hr />
      <TableRegistration />
      <hr />
      {/* временная кнопка */}
      <button onClick={showF104}>f104</button>
      <button onClick={clearState}>clear</button>
    </div>
  );
};
