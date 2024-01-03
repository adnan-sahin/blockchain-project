const Transaction = require("./transaction");
class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  clear() {
    this.transactionMap = {};
  }

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  existingTransaction({ inputAddress }) {
    const transactions = Object.values(this.transactionMap);
    return transactions.find((transaction) => transaction.input.address === inputAddress);
  }
  validTransactions() {
    return Object.values(this.transactionMap).filter((transaction) => Transaction.validTransaction(transaction));
  }
  clearBlockchainTransactions({ chain }) {
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];
      for (let tranasction of block.data) {
        if (this.transactionMap[tranasction.id]) {
          delete this.transactionMap[tranasction.id];
        }
      }
    }
  }
}

module.exports = TransactionPool;
