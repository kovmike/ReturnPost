import React from "react";

const InputWaybills = ({ handler, value }) => {
  return <input type="text" onChange={handler} value={value} />;
};

export { InputWaybills };
