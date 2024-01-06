import React from "react";

function Block(props) {
  const {
    block: { timestamp, hash, data },
  } = props;
  const hashDisplay = `${hash.substring(0, 20)}...`;
  const stringifiedData = JSON.stringify(data);

  const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;
  return (
    <div className="block">
      <div>Hash:{hashDisplay}</div>
      <div>Timestamp:{new Date(timestamp).toLocaleString()}</div>
      <div>Data:{dataDisplay}</div>
    </div>
  );
}

export default Block;
