import React from "react";
import { generateFile } from "./model";

export const Reports = () => {
  return (
    <h1>
      Reports
      <button
        onClick={() => {
          generateFile();
        }}
      >
        save
      </button>
    </h1>
  );
};
