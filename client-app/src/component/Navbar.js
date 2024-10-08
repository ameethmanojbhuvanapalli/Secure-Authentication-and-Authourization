import React, { PureComponent } from 'react';

export default class Navbar extends PureComponent {
  render() {
    const { isLoggedIn,handleLogout } = this.props;

    return (
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="/">Mini Project</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active text-light" aria-current="page" href="/">Home</a>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link active text-light" aria-current="page" href="/Repository">Repository</a> 
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link active text-light" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link active text-light" aria-current="page" href="/Login">Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active text-light" aria-current="page" href="/Register">Register</a> 
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
