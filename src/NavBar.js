import React from 'react';
// import './NavBar.css';

const Navbar = () => {
  return (

<nav className="navbar">
  {/* <div className="navbar-left">
    <a href="/" className="logo">
      ShopNow
    </a>
  </div> */}
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <a href="/sad">Home</a>
      </li>
      {/* <li>
        <a href="/sad#/sad_v1.0">v1.0</a>
      </li> */}
      {/* <li>
        <a href="/sad#/beta">Beta</a>
      </li> */}
      {/* {window.location.href.includes("/config") && <li>
        <a href="/sad#/analytics">Analytics</a>
      </li>} */}

      <li>
        <a href="/sad#/login">Login</a>
      </li>
      <li>
        <a href="/sad#/about">About</a>
      </li>
      <li>
        <a href="/sad#/contact">Contact</a>
      </li>
    </ul>
  </div>
  {/* <div className="navbar-right">
    <a href="/cart" className="cart-icon">
      <i className="fas fa-shopping-cart"></i>
      <span className="cart-count">0</span>
    </a>
    <a href="/account" className="user-icon">
      <i className="fas fa-user"></i>
    </a>
  </div> */}
</nav>
);
};

export default Navbar;