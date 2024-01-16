import React, { useEffect, useState } from "react";
import Transaction from "./Transaction";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const TRANSACTION__POOL_INTERVAL = 5000;

const TransactionPool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  const fetchTransactionpoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then((response) => response.json())
      .then((json) => setTransactionPoolMap(json));
  };

  useEffect(() => {
    fetchTransactionpoolMap();
    const intervalId = setInterval(() => fetchTransactionpoolMap(), TRANSACTION__POOL_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const navigate = useNavigate();
  const fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`).then((response) => {
      if (response.status === 200) {
        alert("success");
        navigate("/blocks");
      } else {
        alert("The mine-transactions block request did not complete!");
      }
    });
  };

  return (
    <div className="transaction-pool">
      <h3>Transaction Pool</h3>
      {Object.values(transactionPoolMap).map((transaction) => {
        return (
          <div key={transaction.id}>
            <hr />
            <Transaction transaction={transaction} />
          </div>
        );
      })}
      <hr />
      <Button variant="info" size="small" onClick={() => fetchMineTransactions()}>
        Mine the Transactions
      </Button>
    </div>
  );
};

export default TransactionPool;
