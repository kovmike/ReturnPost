import React, { useEffect } from "react";
import cl from "./HeaderRegistration.module.css";
import { DestIndex, AbonentBox, ContainerNum } from "./../../molecules/";
import { CheckBox } from "./../../atoms/index";
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
  defectCheked,
  $defectF104,
  generate,
  $allowed,
} from "./../../../model.js";

export const HeaderRegistration = () => {
  const listofDestinationIndexes = useStore($listofDestinationIndexes);
  const destinationIndex = useStore($destinationIndex);
  const abonBoxList = useStore($abonBoxList);
  const selectedAbonBox = useStore($selectedAbonBox);
  const container = useStore($container);
  const stamp = useStore($stamp);
  const defectF104 = useStore($defectF104);
  const allowed = useStore($allowed);
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

  //отметка дефектной ведомости
  const checkDefect = (e) => {
    defectCheked(e.target.checked);
  };

  const showF104 = () => {
    generate();
  };
  const enterContainerNum = (e) => {
    enteredContainerNum(e.target.value);
  };

  const enterStampNum = (e) => {
    enteredStampNum(e.target.value);
  };

  return (
    <div className={cl.wrapperHeadRegistration}>
      <div className={cl.regSetup}>
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
        <CheckBox handler={checkDefect} checked={defectF104} text={"Дефектная ведомость"} />
      </div>
      <div className={cl.f104Setup}>
        <button onClick={showF104} disabled={!allowed}>
          Сформировать Ф.104
        </button>
        <ContainerNum handler={enterContainerNum} text={"Номер контейнера: "} value={container} />
        <ContainerNum handler={enterStampNum} text={"Номер пломбы: "} value={stamp} />
      </div>
    </div>
  );
};
