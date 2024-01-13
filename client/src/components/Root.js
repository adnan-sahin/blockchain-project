import React from "react";

import Layout from "./Layout";
import { Routes, Route } from "react-router-dom";
import Blocks from "./Blocks";
import Home from "./Home";

const Root = () => {
  return (
    <>
      <Layout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks" element={<Blocks />} />
      </Routes>
    </>
  );
};

export default Root;
