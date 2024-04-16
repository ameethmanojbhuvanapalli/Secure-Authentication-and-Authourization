import React, { PureComponent } from 'react';
import Footer from './Footer';
import Guide from './Guide';

export default class Home extends PureComponent {
  render() {
    return (
      <>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
              <div>
                <h1 className="display-4 mb-4">Welcome</h1>
                <h3 className="mb-4">Empowering you with secure digital access.</h3>
                <a href="/login" className="btn btn-dark btn-lg">Get Started</a>
              </div>
            </div>
            <div className="col-md-6">
              <img src="5191079.jpg" className="img-fluid" alt="Welcome Image" />
            </div>
          </div>
        </div>
        <Guide />
        <Footer />
      </>
    );
  }
}
