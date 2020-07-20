import React, { useEffect, useRef } from "react";
import Barcode from "react-barcode";
import { showComponentDialog } from "./../Registration/Registration";

const F104 = () => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (dialogRef.current) dialogRef.current.showModal();
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef}>
      <div>
        <Barcode value="hi, how are you" />
      </div>
      <button onClick={() => showComponentDialog()}>{"❌"}</button>
    </dialog>
  );
};

export { F104 };
