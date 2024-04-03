import { useState } from "react";
import axios from "axios";

import { useNavigate,Link } from 'react-router-dom';

function Register() {
  const [usermsg, setUsermsg] = useState("");  // fillied from response
  const [qrimg, setQrimg] = useState(""); // fillied from response
  const [displayDiv, setDisplayDiv] = useState("none"); // fillied from response
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [mfaflag, setMfaflag] = useState("false");
  //const [otpoption, setotpoption] = useState("");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("ADMIN_ROLES");
  const [totp, setTotp] = useState("");
  const handleRoleChange = (event) => {
    setUserRole(event.target.value)
  }

  const [otpoption, setOtpoption] = useState("0");
  const [otpoptiontext, setOtpoptiontext] = useState("Not required");
  const [isSaveDisabled, setSaveDisabled] = useState(false);
  const [isTotpDisabled, setTotpDisabled] = useState(true);

  const onOptionChange = e => {
    setOtpoption(e.target.value);
    if (e.target.value === "0") {
      setOtpoptiontext("Not required.");
      setMfaflag("false");

    }
    else if (e.target.value === "1") {
      setOtpoptiontext("Time-based One Time Password.");
      setMfaflag("true");
    }
    else {
      setOtpoptiontext("Email One Time Password.");
      setMfaflag("true");
    }

  }
  //////////////////
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:9000/api/user", {
        name: name,
        email: email,
        password: password,
        roles: userRole,
        mfaEnabled: mfaflag,
        mfaoption: otpoption
      });
      console.log(res);
      setUsermsg(res.data.username + " is sucessfully added.");
      if (res.data.qrImageUri != null) {
        setQrimg(res.data.qrImageUri);
        setDisplayDiv("block");
        setSaveDisabled(true);
        setTotpDisabled(false);
      } else {
        setSaveDisabled(false);
        setTotpDisabled(true);
      }
      setName("");
      setEmail2(email);
      setEmail("");
      setPassword("");
      setMfaflag("");
      setUserRole("");
      alert(res.data.username + " is sucessfully added.")
      navigate('/Login');
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }
  
  async function handleSendOtp(event) {
    event.preventDefault();
    var code = totp;
    try {
      const res = await axios.post("http://localhost:9000/api/user/validatecode", {
        email: email2,
        code: code
      });
      setUsermsg(res.data.username + " is sucessfully activated.");
      if (res.data.qrImageUri != null) {
        setQrimg(res.data.qrImageUri);
        setDisplayDiv("block");
      } else {
        setDisplayDiv("none");
      }
      setName("");
      setEmail("");
      setPassword("");
      setMfaflag("");
      setUserRole("");
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }
  
  ///////////////////
  return (
    <div className="container">
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card border-0 shadow rounded-3 my-5">
                    <div className="card-body p-4 p-sm-5">
                        <h1 className="card-title text-center mb-5 fw-dark fs-5"><b>Sign Up</b></h1>
                        <p>{usermsg}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="name" value={name}
                                onChange={(e) => setName(e.target.value)} placeholder="name@example.com" required/>
                                <label htmlFor="floatingInput">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <select className="form-select" id="role" aria-label="Select Role" value={userRole} onChange={handleRoleChange} required>
                                    <option value="ADMIN_ROLES">Admin</option>
                                    <option value="USER_ROLES">User</option>
                                </select>
                                <label htmlFor="role">Role</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email}
                                onChange={(e) => setEmail(e.target.value)} required/>
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="pass" placeholder="Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required/>
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="mb-3">
                                <p>Please select the option for 2 Factor Authentication:</p>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="otpoption" id="otpOptionNotRequired" value="0" checked={otpoption === "0"}
                                    onChange={onOptionChange}/>
                                    <label className="form-check-label" htmlFor="otpOptionNotRequired">
                                        Not required
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="otpoption" id="otpOptionTOTP" value="1" checked={otpoption === "1"}
                                    onChange={onOptionChange}/>
                                    <label className="form-check-label" htmlFor="otpOptionTOTP">
                                        Time-based One Time Password (TOTP)
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="otpoption" id="otpOptionEmailOTP" value="2" checked={otpoption === "2"}
                                    onChange={onOptionChange}/>
                                    <label className="form-check-label" htmlFor="otpOptionEmailOTP">
                                        Email One Time Password (Email OTP)
                                    </label>
                                </div>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" disabled={isSaveDisabled}>Sign Up</button>
                            </div>
                        </form>
                        <div id="qrimgdiv" style={{ display: displayDiv, textAlign: 'center', marginTop: '20px', border: '2px solid #ccc', borderRadius: '10px', padding: '20px' }}>
                          <p style={{ marginBottom: '20px', fontSize: '1.1rem', color: '#333' }}>Scan the QR code below using Google Authenticator or any other authenticator app:</p>
                          {qrimg && <img src={qrimg} alt="QR Code" style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />}
                          <form onSubmit={handleSendOtp} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                              <label htmlFor="totp" style={{ fontSize: '1rem', color: '#333' }}>Enter the Time-based OTP:</label><br />
                              <input type='hidden' className="form-control" name='email2' value={email2} />
                              <input type='text' className="form-control" disabled={isTotpDisabled} name='totp' onChange={(e) => setTotp(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <button type="submit" className="btn btn-secondary" style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }} disabled={isTotpDisabled}>Verify Code</button>
                          </form>
                        </div>
                        <div className="text-center">
                          <p>Don't have an account? <Link to="/Login">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Register;