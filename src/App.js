import React, { Component }from 'react';
import './App.css';
import {
  Route,
  Link,
  Switch,
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom';
import {
  login,
  logout,
  auth,
  createTodo,
  database
} from './utils/FirebaseService';

const linkStyle = {
  textDecoration: "underline",
  color: "rebeccapurple",
  cursor: "pointer"
}

function PrivateRoute ({authenticated, component: Component, ...rest}) {
  return (
    <Route render={props => (
      authenticated 
      ? <Component {...rest} {...props} /> 
      : <Redirect to="/login" />
    )} />
  )
}

function Login({authenticated}) {
  if(authenticated) return <Redirect to="/dashboard"/>
  return (
    <div>
      <h2>You need to login to see this</h2> 
      <button onClick={login}>Login With Google</button>
    </div>
  )
}
function Dashboard(
  user, test, handleChange, handleSubmit, todos
  ) {
  return (
    <div>
      <h2>Welcome to Your Dashboard, {user.displayName.split(" ")[0]}</h2> 
      <img
            style={{
                height: 100,
                borderRadius: '50%',
                border: '2px solid black'
            }} 
            src={user.photoURL} 
            alt={user.displayName}
            />
            <br />
            <h5>Here's your todo items</h5>
            <ul>
              todos.map(([id, text]) => (

              ))
            </ul> 
            <form onSubmit={handleSubmit}>
              <input name="text" value={test} onChange={handleChange} />
              <button>Add todo</button>
            </form>
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
  constructor() {
    super();
    this.state = {
      authenticated: false,
      test: "",
      user: null,
      dbRef: null,
      todos: []
    }
  }

  handleChange = e => {
    this.setState({[e.target.name] : e.target.value });
  }
  
  handlePopulateTodos = () => [
    database.ref(this.state.dbRef)
    .on('value', snapshot => {
      const newStateArray = [];
      snapshot.forEach(childSnapshot => {
        newStateArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      this.setState({todos: newStateArray});
    })
  ];

  handleSubmit = e => {
    const { dbRef, text } = this.state;
    e.preventDefault();
    createTodo(dbRef, {
      text,
      completed: false
    }).then(() => this.setState({text: ""}));
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if(user) {
        this.setState({authenticated: true,
        user,
        dbRef: `users/${user.uid}/todos`,
        })
      }
      else {
        this.setState({authenticated: false,
        user: null,
        dbRef: null});
      }
    });
  }

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
          {
              this.state.authenticated
              &&
              <li style={linkStyle}>
                  <span onClick={logout}>Logout</span>
              </li>
          }
      </ul>
      <Switch>
          <Route exact path="/" component={home} />
          <PrivateRoute 
          authenticated={this.state.authenticated}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          user={this.state.user}
          text={this.state.text}
          path="/dashboard" 
          component={Dashboard} 
          />
          <Route path="/login" render={props => (
              <Login 
              {...props}
              authenticated={this.state.authenticated}
              />
          )} />
      </Switch>
    </Router>
    );
  }
}


export default App;
