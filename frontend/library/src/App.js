import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./DashBoard/DashBoard";
import SignUp from "./user/SignUp";
import Login from "./user/Login";
import Mybook from "./user/Mybook";
import Edit from "./Admin/Edit";
import Display from "./user/Display";
import AdminSignup from "./auth/AdminSignup";
import Create from "./Admin/Create";
import GetProduct from "./Admin/GetProduct";
import AdminLogin from "./auth/AdminLogin";
import Activity from "./Admin/Activity";
import Reset from "./user/Reset";
import NewPassword from "./user/NewPassword";
import Message from "./Admin/Message";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" exact component={Login} />
        <Route path="/admin/dashboard/create" exact component={Create} />
        <Route path="/admin/dashboard/getbook" exact component={GetProduct} />
        <Route path="/api/update/books/:id" exact component={Edit} />
        <Route path="/admin/signup" exact component={AdminSignup} />
        <Route path="/admin/login" exact component={AdminLogin} />
        <Route path="/mybooks" exact component={Mybook} />
        <Route path="/activity" exact component={Activity} />
        <Route path="/message" exact component={Message} />
        <Route path="/user/dashboard" component={Display} />
        <Route path="/reset" component={Reset} />
        <Route path="/newpassword" component={NewPassword} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
