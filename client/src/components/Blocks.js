import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Block from "./Block";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [pageId, setPageId] = useState(1);
  const [blocksLength, setBlocksLength] = useState(0);

  useEffect(() => {
    fetch(`${document.location.origin}/api/blocks/length`)
      .then((res) => res.json())
      .then((json) => {
        setBlocksLength(json);
      });
    fetchBlocksByPageId(pageId);
  }, []);

  const fetchBlocksByPageId = (pageId) => {
    fetch(`${document.location.origin}/api/blocks/${pageId}`)
      .then((res) => res.json())
      .then((json) => {
        setBlocks(json);
      });
  };

  return (
    <div className="blocks">
      <h3>Blocks</h3>
      <div>
        {[...Array(Math.ceil(blocksLength / 5)).keys()].map((key) => {
          const pageNumber = key + 1;
          return (
            <span key={key} onClick={() => fetchBlocksByPageId(pageNumber)}>
              <Button variant="info" size="small">
                {pageNumber}
              </Button>{" "}
            </span>
          );
        })}
      </div>
      {blocks.map((block) => {
        return <Block key={block.hash} block={block} />;
      })}
    </div>
  );
};

export default Blocks;
