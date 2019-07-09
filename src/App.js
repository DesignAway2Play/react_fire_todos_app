import React, { Component }from 'react';
import './App.css';
import {
  Route,
  Link,
  Switch,
  Redriect,
  BrowserRouter as Router
} from 'react-router-dom';


function Login() {
  return (
    <div>
      <h2>You need to login to see this</h2> 
      <button>Login with Google</button>
    </div>
  )
}
function Dashboard() {
  return (
    <div>
      <h2>Welcome to Your Dashboard</h2> 
    </div>
  )
}
function home() {
  return (
    <div>
      <h1>Welcome to React Firebase Todos</h1> 
    </div>
  )
}


class App extends Component {
  render () {
    return (
      <Router>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={home} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    );
  }
}


export default App;
