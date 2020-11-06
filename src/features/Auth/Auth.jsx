import React from "react";
import { useState } from "react";
import { setNewLoggedUser, $loggedUser } from "./model";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "effector-react";

export const Auth = ({ history }) => {
  const [userId, setUserId] = useState("");
  const loggedUser = useStore($loggedUser);
  console.log(loggedUser);
  history = useHistory();
  //пушим в хистори урл приписки, только после того как изменился loggedUser
  useEffect(() => {
    if (loggedUser) history.push("/registration");
  }, [history, loggedUser]);

  const changeInput = (e) => {
    setUserId(e.target.value);
  };

  const authSubmit = () => {
    setNewLoggedUser(userId);
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
