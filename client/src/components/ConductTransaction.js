import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ConductTransaction = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [knownAddresses, setKnownAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then((res) => res.json())
      .then((json) => {
        setKnownAddresses(json);
      });
  }, []);

  const submitConductTransaction = () => {
    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount, knownAddresses: [] }),
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
      <br />
      <h4>Known Addresses </h4>
      {knownAddresses.map((knownAddress) => {
        return (
          <div key={knownAddress}>
            {knownAddress}
            <br />
          </div>
        );
      })}
      <br />
      <div className="form">
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
          <Button variant="info" size="small" onClick={submitConductTransaction}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConductTransaction;
