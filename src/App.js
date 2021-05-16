import Dashboard from "./components/Dashboard";
import NewParty from "./components/NewParty";
import NewDispatch from "./components/NewDispatch";
import NewReceive from "./components/NewReceive";
import DailyStock from "./components/DailyStock";
import '../src/App.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  const gas=[
    {gas: 'O2'}, 
    {gas: 'CO2'}, 
    {gas: 'N2'}, 
    {gas: 'DA'}, 
    {gas: 'N20'}
  ]
  return (
    <div className="App">
      <Router>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/newParty' component={NewParty} />
        <Route exact path='/newDispatch' component={NewDispatch} />
        <Route exact path='/newReceive' component={NewReceive} />
        <Route exact path='/dailyStock' component={()=><DailyStock gas={gas} />} />
        {/* <Route exact path='/contact' component={Contact} /> */}
      </Router>    
    </div>
  )
}

export default App;
