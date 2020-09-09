import React from "react";

export const Select = ({ arr, handler, value }) => {
  const prepareOptions = (arrForOptions) => {
    //добавим 0 для неактивной первой строки селекта
    return [0, ...arrForOptions].map((option) => {
      if (option === 0 && value === 0)
        return (
          <option value="0" disabled selected>
            Выбрать..
          </option>
        );
      return option + "" === value + "" ? (
        <option selected value={option}>
          {option}
        </option>
      ) : (
        <option value={option}>{option}</option>
      );
    });
  };

  return <select onChange={handler}>{prepareOptions(arr)}</select>;
};
