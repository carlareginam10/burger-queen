import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from "./pages/Home";
import Hall from "./pages/Hall";
import Kitchen from './pages/Kitchen';

function App() {
  return(
    <Router>
        <Route path="/" exact component={Home} />
        <Route path="/hall" component={Hall} />
        <Route path="/kitchen" component={Kitchen} />
 </Router>
  );
}

export default App;
