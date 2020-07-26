import React, { useState } from "react";
import { Header } from "./ui/organisms/Header/Header";
import { Navbar } from "./ui/organisms/Navbar/Navbar";
import { routes } from "./ui/common/routes";
import classes from "./App.module.css";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { $loggedUser } from "./features/Auth";
import { useStore } from "effector-react";

export const App = ({ history }) => {
  const [state, setState] = useState(false);
  const loggedUser = useStore($loggedUser);
  history = useHistory();
  return (
    <div className={classes.wrapper}>
      <Header user={loggedUser ?? "Ожидание авторизации"} />
      <Navbar />
      <div className={classes.workArea}>
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.component} /> //children={<route.component />} />
          ))}
          {loggedUser ? history.push("/registration") : <Redirect to={{ pathname: "/login" }} />}
        </Switch>
      </div>
    </div>
  );
};
