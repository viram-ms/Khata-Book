import React from 'react';
import './App.css';
import { useStateValue } from './StateProvider';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import Login from './Login';
import AuthRoute from './AuthRoute';
import LoginRoute from './LoginRoute';
import Dashboard from './Dashboard';
import Landing from './Landing';

function App() {
  const [{user}, dispatch] = useStateValue();

  return (
    <div className="app">
        <div className="app__body">
        <Router>
          <Switch>
            <LoginRoute exact path="/" component={Login} />
            <AuthRoute exact path="/dashboard" component={Landing} />
            <AuthRoute exact path="/dashboard/:roomId/:teamId/:teamName" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
