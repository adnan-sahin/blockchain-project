import React, { useState } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ConductTransaction = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const submitConductTransaction = () => {
    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message || json.type);
        navigate("/transaction-pool");
      });
  };

  return (
    <div className="conduct-transaction">
      <h3>Conduct a Transaction</h3>
      <FormGroup>
        <FormControl
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormControl
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
        />
      </FormGroup>
      <div>
        <Button variant="danger" size="small" onClick={submitConductTransaction}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ConductTransaction;
