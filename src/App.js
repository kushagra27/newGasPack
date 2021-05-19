import Dashboard from "./components/Dashboard";
import NewParty from "./components/NewParty";
import NewDispatch from "./components/NewDispatch";
import NewReceive from "./components/NewReceive";
import DailyStock from "./components/DailyStock";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from "react";
import db from "./components/Firestore";
import { Spinner } from "react-bootstrap";
import PartyHistory from "./components/PartyHistory";


class App extends React.Component {
  constructor(props){
    super()
    this.state = {
      gas: [
        {gas: 'O2'},
        {gas: 'DA'},
        {gas: 'N2'}, 
        {gas: 'H2'},
        {gas: 'AMM'},
        {gas: 'CO2'}, 
        {gas: 'ARG'},
        {gas: 'AIR'},
        {gas: 'N20'},
      ],
      loading: true,
      partyNames:[]
    }
  }
  componentDidMount = ()=>{
    db.collection('parties').get().then((querySnapshot) => {
      var partyNames = []
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          partyNames.push(doc.data().partyName)
      });
      this.setState({partyNames, loading: false})
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
  }

  render(){
    return (
      this.state.loading?
      <Spinner animation="border">

      </Spinner>
      :
      <div className="App">
        <Router>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/newParty' component={()=><NewParty gas={this.state.gas} />} />
          <Route exact path='/newDispatch' component={()=><NewDispatch gas={this.state.gas} partyNames={this.state.partyNames} />} />
          <Route exact path='/newReceive' component={()=><NewReceive gas={this.state.gas} partyNames={this.state.partyNames} />} />
          <Route exact path='/dailyStock' component={()=><DailyStock gas={this.state.gas} partyNames={this.state.partyNames} />} />
          <Route exact path='/partyHistory' component={()=><PartyHistory gas={this.state.gas} partyNames={this.state.partyNames} />} />
          {/* <Route exact path='/contact' component={Contact} /> */}
        </Router>    
      </div>
    )
  }
}

export default App;
