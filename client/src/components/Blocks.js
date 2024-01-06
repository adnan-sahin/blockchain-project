import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Block from "./Block";

function Blocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/blocks`)
      .then((res) => res.json())
      .then((json) => {
        setBlocks(json);
      });
  }, []);

  return (
    <div className="blocks">
      <h3>Blocks</h3>
      {blocks.map((block) => {
        return <Block key={block.hash} block={block} />;
      })}
    </div>
  );
}

export default Blocks;
