import React, { useState } from 'react';
import Cookies from 'universal-cookie';

const CookieConsent = () => {
  const cookies = new Cookies();
  const [consented, setConsented] = useState(cookies.get('cookieConsent'));

  const handleConsent = () => {
    cookies.set('cookieConsent', true, { path: '/' });
    setConsented(true);
  };

  const handleDecline = () => {
    // Optionally handle decline
  };

  if (!consented) {
    return (
      <div className="cookie-consent">
        <p>This website uses cookies to ensure you get the best experience.</p>
        <button onClick={handleConsent}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    );
  }

  return null; // Once consented, no need to display the consent component
};

export default CookieConsent;
