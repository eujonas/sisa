import { Switch } from "react-router-dom";
import Route from "./Route";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Dashboard from "../pages/Dashboad";
import Perfil from "../pages/Perfil";
import Disciplinas from '../pages/Disciplinas';
import New from "../pages/New";
export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register" component={Cadastro} />
   
      <Route exact path="/dashboard" component={Dashboard} isPrivate/>
      <Route exact path="/perfil" component={Perfil} isPrivate />
      <Route exact path="/create" component={Disciplinas} isPrivate />
      <Route exact path="/new" component={New} isPrivate />
      <Route exact path="/new/:id" component={New} isPrivate />
   
    </Switch>
  );
}
