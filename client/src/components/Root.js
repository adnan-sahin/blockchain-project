import React from "react";

import Layout from "./Layout";
import { Routes, Route } from "react-router-dom";
import Blocks from "./Blocks";
import Home from "./Home";
import ConductTransaction from "./ConductTransaction";
import TransactionPool from "./TransactionPool";

const Root = () => {
  return (
    <>
      <Layout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/conduct-transaction" element={<ConductTransaction />} />
        <Route path="/transaction-pool" element={<TransactionPool />} />
      </Routes>
    </>
  );
};

export default Root;
