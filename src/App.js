import Dashboard from "./components/Dashboard";
import NewParty from "./components/NewParty";
import NewDispatch from "./components/NewDispatch";
import NewReceive from "./components/NewReceive";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/newParty' component={NewParty} />
        <Route exact path='/newDispatch' component={NewDispatch} />
        <Route exact path='/newReceive' component={NewReceive} />
        {/* <Route exact path='/contact' component={Contact} /> */}
      </Router>    
    </div>
  )
}

export default App;
