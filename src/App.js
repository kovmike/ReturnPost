import React from "react";
import { Header } from "./ui/organisms/Header/Header";
import { Navbar } from "./ui/organisms/Navbar/Navbar";
import { routes } from "./ui/common/routes";
import classes from "./App.module.css";
import { Switch, Route } from "react-router-dom";

export const App = ({ history }) => {
  return (
    <Switch>
      <div className={classes.wrapper}>
        <Header />
        <Navbar />
        <div className={classes.workArea}>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.component} /> //children={<route.component />} />
          ))}
        </div>
        {/* <Route path="/f104" exact component={F104} /> */}
      </div>
    </Switch>
  );
};
