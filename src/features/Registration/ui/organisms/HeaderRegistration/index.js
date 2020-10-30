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
  enteredContainerNum,
  enteredStampNum,
  $container,
  $stamp,
  $destinationIndex,
} from "./../../../model.js";
import { DestIndex } from "./../../molecules/DestIndex/index.js";
import { AbonentBox } from "../../molecules/AbonentBox/index.js";
import { ContainerNum } from "../../molecules/ContainerNum/index.js";
//, AbonentBox, ContainerNum
export const HeaderRegistration = () => {
  const listofDestinationIndexes = useStore($listofDestinationIndexes);
  const destinationIndex = useStore($destinationIndex);
  const abonBoxList = useStore($abonBoxList);
  const selectedAbonBox = useStore($selectedAbonBox);
  const container = useStore($container);
  const stamp = useStore($stamp);

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

  const enterContainerNum = (e) => {
    //console.log(e.target.value);
    enteredContainerNum(e.target.value);
  };

  const enterStampNum = (e) => {
    enteredStampNum(e.target.value);
  };

  return (
    <>
      <DestIndex
        arrOfIndexes={listofDestinationIndexes}
        handler={(e) => {
          selectDestinationIndex(e);
        }}
        value={destinationIndex}
      />
      <AbonentBox
        abonBoxNumber={selectedAbonBox[0]?.abonentbox}
        firmName={selectedAbonBox[0]?.firmname}
        abonBoxList={abonBoxList}
        pickAbonBox={(e) => {
          pickAbonBox(e);
        }}
        addToClearButton={resetSelectedAbonBox}
      />
      <ContainerNum handler={enterContainerNum} text={"Номер контейнера: "} value={container} />
      <ContainerNum handler={enterStampNum} text={"Номер печати: "} value={stamp} />
    </>
  );
};
