// app/components/Footer.js

import React from "react";

const Footer = () => (
  <footer className="bg-primary-600 text-white py-6">
    <div className="container-custom text-center">
      <p>
        &copy; {new Date().getFullYear()} SafeDrive DBMS. All rights reserved.
      </p>
      <p className="mt-2">
        Enhancing road safety in Uganda, one driver at a time.
      </p>
    </div>
  </footer>
);

export default Footer;
