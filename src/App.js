import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Home from "./pages/Home";
import Salao from "./pages/Salao";


function App() {
  return(
    <Router>
        <Route path="/" exact component={Home} />
        <Route path="/salao" component={Salao} />
        <Route path="/cozinha" component={Cozinha} />
 </Router>
  );
}


function Cozinha() {
  return (
    <div>
      Estamos na cozinha
    </div>

  )

}

export default App;
