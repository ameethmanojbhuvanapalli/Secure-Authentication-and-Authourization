import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import Home from "./component/Home";
import Register from "./component/Register";
import Login from "./component/Login";
import "./App.css";
import Repository from "./component/Repository";
import Navbar from "./component/Navbar";
import CookieConsent from "./component/Cookie";

class App extends Component {
    render() {
        return (
            <>
            <CookieConsent/>
            <Navbar/>
            <Router>
            {/*<table align="center">
            <tr>
                <td><Link to="/" style={{ color: 'black' }}><b>Home</b></Link></td>
                <td><Link to="/Register" style={{ color: 'black' }}><b>Register</b></Link></td>
                <td><Link to="/Login" style={{ color: 'black' }}><b>Login</b></Link></td>
                <td><Link to="/Repository" style={{ color: 'black' }}><b>Repository</b></Link></td>
            </tr>
        </table>*/}   
              {/* <Link to="/">Home</Link>&nbsp;<Link to="/Register">Register</Link>&nbsp;<Link to="/Login">Login</Link> */}
                {/* <div className="App">
                    <ul className="App-header">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/Register">
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link to="/Login">
                                Login
                            </Link>
                        </li>
                    </ul> */}
                    <Routes>
                        <Route
                            path="/"
                            element={<Home />}
                        ></Route>
                        <Route
                            path="/Register"
                            element={<Register />}
                        ></Route>
                        <Route
                            path="/Login"
                            element={<Login />}
                        ></Route>
                        <Route
                            path="/Repository"
                            element={<Repository />}
                        ></Route>
                    </Routes>
                {/* </div> */}
            </Router>
            </>
        );
    }
}

export default App;