import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import logo from "../assets/logo.png";

const Home = () => {
  const [walletInfo, setWalletInfo] = useState({ address: null, balance: null });

  useEffect(() => {
    fetch(`${BASE_URL}/api/wallet-info`)
      .then((response) => response.json())
      .then((json) => {
        setWalletInfo({ address: json.address, balance: json.balance });
      });
  }, []);

  return (
    <div className="app">
      <img className="logo" src={logo} />
      <br />
      <div>Welcome to Blockchain!</div>
      <div className="wallet-info">
        <div>Address:{walletInfo.address}</div>
        <div>Balance:{walletInfo.balance}</div>
      </div>
    </div>
  );
};

export default Home;
