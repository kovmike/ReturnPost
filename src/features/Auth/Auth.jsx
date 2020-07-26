import React from "react";
import { useState } from "react";
import { setLoggedUser } from "./model";

export const Auth = () => {
  const [userId, setUserId] = useState("");

  const changeInput = (e) => {
    setUserId(e.target.value);
  };

  const authSubmit = () => {
    setLoggedUser(userId);
  };

  return (
    <div>
      <p>Вы не авторизованы</p>
      <label>Enter your ID</label>
      <input type="text" onChange={changeInput} />
      <button onClick={authSubmit}>Enter to program</button>
    </div>
  );
};
