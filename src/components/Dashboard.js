import NewParty from "./NewParty";
import NewDispatch from "./NewDispatch";
import NewReceive from "./NewReceive";
import DailyStock from "./DailyStock";
import PartyRegister from "./PartyRegister";
import GasRegister from "./GasRegister";
import AllPartyRegister from "./AllPartyRegister";
import EditChallan from "./EditChallan";
import EditER from "./EditER";
import DispatchSupplier from "./DispatchSupplier";
import ReceiveSupplier from "./ReceiveSupplier";
import Test from "./Test";
import UserProvider from "./UserProvider"
import {db} from "./Firestore";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from "react";
import { Spinner } from "react-bootstrap";


class Dashboard extends React.Component {
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
      <UserProvider>
          <div className="Dashboard">
        <Router>
          <Route exact path='/' component={()=><NewParty gas={this.state.gas} signOut={this.props.signOut} />} />
          <Route exact path='/newParty' component={()=><NewParty gas={this.state.gas} signOut={this.props.signOut} />} />
          <Route exact path='/newDispatch' component={()=><NewDispatch gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/dispatchSupplier' component={()=><DispatchSupplier gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/newReceive' component={()=><NewReceive gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/receiveSupplier' component={()=><ReceiveSupplier gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/dailyStock' component={()=><DailyStock gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/partyRegister' component={()=><PartyRegister gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/gasRegister' component={()=><GasRegister gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/allPartyRegister' component={()=><AllPartyRegister gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/editChallan' component={()=><EditChallan gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/editEr' component={()=><EditER gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          <Route exact path='/test' component={()=><Test gas={this.state.gas} partyNames={this.state.partyNames} signOut={this.props.signOut} />} />
          {/* <Route exact path='/contact' component={Contact} /> */}
        </Router>    
      </div>
      </UserProvider>
      
    )
  }
}

export default Dashboard;
