import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} JobBoard. All rights reserved.</p>
      <div className="footer-links">
        <a href="#">Contact</a>
        <a href="#">Privacy</a>
        <a href="#">LinkedIn</a>
        <a href="#">GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;
