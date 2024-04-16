import React from "react";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [usermsg, setUsermsg] = useState("");  // filled from response
  const [otpoption, setOtpoption] = useState("0"); // filled from response

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [mfaflag, setMfaflag] = useState("false");

  const [totp, setTotp] = useState("");
  const [isLoginDisabled, setLoginDisabled] = useState(false);
  const [isSendOtpDisabled, setSendOtpDisabled] = useState(true);

  async function handleSubmit(event) {
    event.preventDefault();
    var iotp = "0";
    if (otpoption === "") {
      setOtpoption("0");
    }
    if (totp !== "") {
      iotp = totp;
    }
    try {
      const res = await axios.post("http://localhost:9002/api/user/login", {
        email: email,
        password: password,
        otp: iotp,
        credentials: 'cross-origin',
        withCredentials:true
      });
      if (res.data.token != null) {
        setUsermsg(res.data.token);
        setLoginDisabled(true);
        setSendOtpDisabled(true);
      }
      if (res.data.otpOption === "1") {
        setUsermsg("Please enter Time-based One Time Password generated in Authenticator App.");
        setLoginDisabled(true);
        setSendOtpDisabled(false);
      }
      if (res.data.otpOption === "2") {
        setUsermsg("Please enter One Time Password sent to your registered Email.");
        setLoginDisabled(true);
        setSendOtpDisabled(false);
      }
    } catch (err) {
      setUsermsg("Invalid credentials.");
      setLoginDisabled(false);
    }
  } 
  return (
    <div className="container">
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card border-0 shadow rounded-3 my-5">
                    <div className="card-body p-4 p-sm-5">
                        <h1 className="card-title text-center mb-5 fw-dark fs-5"><b>Sign In</b></h1>
                        <p>{usermsg}</p>
                        <form onSubmit={handleSubmit} id="loginform">
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="name@example.com" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                <label htmlFor="email">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="pass" placeholder="Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required/>
                                <label htmlFor="pass">Password</label>
                            </div>
                            <div className="d-grid">
                                <button id="login" type="submit" className="btn btn-primary btn-login text-uppercase fw-bold" disabled={isLoginDisabled}>Login</button>
                            </div>
                            <div id="otpField" style={{ display: isSendOtpDisabled ? 'none' : 'block' }} className=" my-5">
                                <p>Enter the OTP:</p>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" disabled={isSendOtpDisabled} name='totp' value={totp} placeholder=""
                                    onChange={(e) => setTotp(e.target.value)}/>
                                    <label htmlFor="otpInput">OTP</label>
                                    <div className="d-grid my-3">
                                        <button id="otp" className="btn btn-secondary btn-login text-uppercase fw-bold" type="submit"
                                        onClick={handleSubmit} disabled={isSendOtpDisabled}>Verify Code</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Login;
