import React from "react";

const DatePicker = ({ handler }) => {
  return <input type="date" onChange={handler} />;
};

export { DatePicker };
