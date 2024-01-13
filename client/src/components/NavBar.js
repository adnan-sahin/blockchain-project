import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/blocks">Blocks</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
