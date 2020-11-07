import React, { useEffect } from "react";
import { Header } from "./ui/organisms/Header/Header";
import { Navbar } from "./ui/organisms/Navbar/Navbar";
import { routes } from "./ui/common/routes";
import classes from "./App.module.css";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { $loggedUser, Auth, checkStoredUserFx } from "./features/Auth/";
import { useStore } from "effector-react";

export const App = ({ history }) => {
  //проверяем наличие юзера в ЛС, результат попадает в гард, и либо ничего не происходит, либо пишется в стор

  const loggedUser = useStore($loggedUser);
  history = useHistory();
  //при ините проги редиректим сразу на логин, но если юзер есть, то на приписку
  useEffect(() => {
    checkStoredUserFx();
    if (loggedUser) {
      history.push("/registration");
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <Header user={loggedUser ? loggedUser : "Ожидание авторизации"} />
      <Navbar />
      <div className={classes.workArea}>
        {/* роутинг */}
        <Switch>
          {/* почему-то если засунуть логин в map то не работает */}
          <Route path="/login" exact component={Auth} />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={() => {
                route.component();
                // редирект на логин, если не авторизован пользователь
                return loggedUser ? route.component() : <Redirect to={{ pathname: "/login" }} />;
              }}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
};
