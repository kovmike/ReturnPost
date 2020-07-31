import React, { useEffect } from "react";
import { useStore } from "effector-react";
import {
  $listofDestinationIndexes,
  pickDestinationIndex,
  toFetchAbonBox,
  $abonBoxList,
  $selectedAbonBox,
  selectAbonBox,
  resetSelectedAbonBox,
} from "./../../../model.js";
import { DestIndex, AbonentBox } from "./../../molecules";

export const HeaderRegistration = () => {
  const listofDestinationIndexes = useStore($listofDestinationIndexes);
  const abonBoxList = useStore($abonBoxList);
  const selectedAbonBox = useStore($selectedAbonBox);
  //запуск формирования списка абонентских ящиком
  useEffect(() => {
    toFetchAbonBox();
  }, []);

  const selectDestinationIndex = (e) => {
    pickDestinationIndex(e.target.value);
  };
  const pickAbonBox = (e) => {
    //проверяем длину инпута, только после выделения нужного а/я вызываем евент записи в стор выбранного ая
    if (e.target.value.length > 5) selectAbonBox(e.target.value.split(":")[0].trim());
  };
  return (
    <>
      <DestIndex
        arrOfIndexes={listofDestinationIndexes}
        handler={(e) => {
          selectDestinationIndex(e);
        }}
      />
      <AbonentBox
        abonBoxNumber={selectedAbonBox[0]?.abonentbox}
        abonBoxList={abonBoxList}
        pickAbonBox={(e) => {
          pickAbonBox(e);
        }}
        addToClearButton={resetSelectedAbonBox}
      />
    </>
  );
};
