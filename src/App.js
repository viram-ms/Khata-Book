import React from 'react';
import './App.css';
import { useStateValue } from './StateProvider';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from './Login';
import Sidebar from './Sidebar';
import AuthRoute from './AuthRoute';
import LoginRoute from './LoginRoute';
import Dashboard from './Dashboard';

function App() {
  const [{user}, dispatch] = useStateValue();

  return (
    <div className="app">
        <div className="app__body">
        <Router>
          <Switch>
            <LoginRoute exact path="/" component={Login} />
            <AuthRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
