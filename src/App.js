import Dashboard from "./components/Dashboard";
import NewParty from "./components/NewParty";
import NewDispatch from "./components/NewDispatch";
import NewReceive from "./components/NewReceive";
import DailyStock from "./components/DailyStock";
import PartyRegister from "./components/PartyRegister";
import GasRegister from "./components/GasRegister";
import AllPartyRegister from "./components/AllPartyRegister";
import EditChallan from "./components/EditChallan";
import EditER from "./components/EditER";
import DispatchSupplier from "./components/DispatchSupplier";
import ReceiveSupplier from "./components/ReceiveSupplier";
import Test from "./components/Test";
import UserProvider from "./components/UserProvider"
import SignIn from "./components/SignIn"

import '../src/App.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from "react";
import {db} from "./components/Firestore";
import { Spinner } from "react-bootstrap";


class App extends React.Component {
  constructor(props){
    super()
    this.state = {
      loading: false
    }
  }
  componentDidMount = ()=>{
    
  }

  render(){
    return (
      this.state.loading?
      <Spinner animation="border">

      </Spinner>
      :
          <div className="App">
            <SignIn />
          </div>
      
    )
  }
}

export default App;
