import React from "react";

export const Table = ({ title, handler, value }) => {
  return (
    <input onChange={handler} value={value}>
      {title}
    </input>
  );
};
