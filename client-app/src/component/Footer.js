import React, { PureComponent } from 'react';

export default class Footer extends PureComponent {
  render() {
    return (
      <footer className="bg-dark text-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <h5 className="text-uppercase mb-3">Two-factor authentication</h5>
              <p>
                Secure Authentication and Authorization System: A robust multi-factor authentication and authorization system for a digital repository, ensuring stringent security measures while providing seamless user experiences in accessing digital resources.
              </p>
            </div>
            <div className="col-lg-6">
              <h5 className="text-uppercase mb-3">Contact</h5>
              <ul className="list-unstyled">
                <li>Email: nmammfa@gmail.com</li>
                <li>Phone: +91 7483252808</li>
                <li>Location: India</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-secondary py-3 text-center">
          <p className="mb-0">© 2024 Mini Project. All rights reserved.</p>
        </div>
      </footer>
    );
  }
}
