import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

const Block = (props) => {
  const [displayTransaction, setDisplayTransaction] = useState(false);
  const {
    block: { timestamp, hash, data },
  } = props;
  const hashDisplay = `${hash.substring(0, 20)}...`;

  const displayTransactionData = () => {
    const stringifiedData = JSON.stringify(data);
    return stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;
  };

  const toggleDisplayTransaction = () => {
    setDisplayTransaction(!displayTransaction);
  };
  return (
    <div className="block">
      <div>Hash:{hashDisplay}</div>
      <div>Timestamp:{new Date(timestamp).toLocaleString()}</div>
      {displayTransaction ? (
        <>
          <div>
            {data.map((transaction) => (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            ))}
          </div>
          <hr />
          <Button variant="danger" size="small" onClick={toggleDisplayTransaction}>
            Show Less
          </Button>
        </>
      ) : (
        <>
          <div>Data:{displayTransactionData()}</div>
          <Button variant="danger" size="small" onClick={toggleDisplayTransaction}>
            Show More...
          </Button>
        </>
      )}
    </div>
  );
};

export default Block;
