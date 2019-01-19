import React from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import Login from './Login.js';
import ToDoListPage from './TodoListPage.js';
import Settings from './Settings.js';

const Routes = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Redirect exact path="/" to="/login" />
          <Route path="/login" component={Login} />
          <Route path="/todo" component={ToDoListPage} />
          <Route path="/settings" component={Settings} />
          <Route component={Error} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Routes;
