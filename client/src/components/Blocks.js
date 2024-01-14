import React, { useEffect, useState } from "react";
import Block from "./Block";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${document.location.origin}/api/blocks`)
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
};

export default Blocks;
