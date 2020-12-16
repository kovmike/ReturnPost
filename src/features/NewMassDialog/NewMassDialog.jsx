import { useEffect, useState, useRef } from "react";
import { showNewMassDialog, editMass } from "./../Registration/model";

const NewMassDialog = () => {
  const [mass, setMass] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.showModal();
  }, [ref]);

  const enter = () => {
    showNewMassDialog();
    editMass(mass);
  };

  const changeMass = (e) => {
    setMass(e.target.value);
  };

  return (
    <dialog ref={ref}>
      <span>Введите исправленную массу, грамм: </span>
      <input onChange={changeMass}></input>
      <button onClick={enter}>enter</button>
    </dialog>
  );
};

export { NewMassDialog };
