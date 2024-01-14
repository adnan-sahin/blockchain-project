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
        <li>
          <NavLink to="/conduct-transaction">Conduct a Transaction</NavLink>
        </li>
        <li>
          <NavLink to="/transaction-pool">Transaction Pool</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
