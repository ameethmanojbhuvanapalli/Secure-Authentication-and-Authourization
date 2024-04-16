import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./component/Home";
import Register from "./component/Register";
import Login from "./component/Login";
import "./App.css";
import Repository from "./component/Repository";
import Navbar from "./component/Navbar";
import CookieConsent from "./component/Cookie";
import axios from "axios";

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          isLoggedIn: false, // Set initial login status
          loading: true // Set loading state
        };
    }
    
    componentDidMount() {
        this.checkLogin();
    }

    checkLogin = async () => {
        try {
            const isLoggedIn = await this.fetchToken();
            this.setState({ isLoggedIn, loading: false });
        } catch (error) {
            console.error('Error checking login status:', error);
            this.setState({ loading: false });
        }
    };

    handleLogout = async () => {
        try {
          await axios.get('http://localhost:9002/api/user/logout');
          this.setState({ isLoggedIn: false });
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

    async fetchToken() {
        try {
            const response = await axios.get("http://localhost:9002/api/user/getToken", { credentials: 'cross-origin', withCredentials: true});
            const token = response.data;
            console.log("Token received from server:", token);
            if (token !== 'defaultToken') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching token:', error);
            return false;
        }
    }

    render() {
        const { isLoggedIn } = this.state;

        return (
            <>
            <CookieConsent/>
            <Navbar isLoggedIn={isLoggedIn}  handleLogout={this.handleLogout}/>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Repository" element={<Repository />} />
                </Routes>
            </Router>
            </>
        );
    }
}

export default App;
