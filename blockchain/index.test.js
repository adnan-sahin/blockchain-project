const Blockchain = require("./index");
const Block = require("./block");
const { cryptoHash } = require("../util");
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

describe("Blockchain", () => {
  let blockchain, newBlockchain, originalChain, errorMock;

  beforeEach(() => {
    errorMock = jest.fn();
    global.console.error = errorMock;

    blockchain = new Blockchain();
    newBlockchain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("add a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Foxes" });
        blockchain.addBlock({ data: "Cats" });
      });
      describe("and a lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "some-changed-block-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const badBlock = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let logMock;
    beforeEach(() => {
      logMock = jest.fn();

      global.console.log = logMock;
    });
    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        blockchain.replaceChain(newBlockchain.chain);
        newBlockchain.chain[0] = { new: "chain" };
      });
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });
      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newBlockchain.addBlock({ data: "Bears" });
        newBlockchain.addBlock({ data: "Foxes" });
        newBlockchain.addBlock({ data: "Cats" });
      });
      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newBlockchain.chain[2].hash = "some-fake-hash";
          blockchain.replaceChain(newBlockchain.chain);
        });
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });
        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newBlockchain.chain);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newBlockchain.chain);
        });
        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
    describe("and the `validateTransactions` flag is true", () => {
      it("calls validTransactionData", () => {
        const validTransactionDataMock = jest.fn();
        blockchain.validTransactionData = validTransactionDataMock;

        newBlockchain.addBlock({ data: "test-data" });

        blockchain.replaceChain(newBlockchain.chain, true);
        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });
  describe("validTransactionData", () => {
    let transaction, rewardTransaction, wallet;
    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({ recipient: "test-address", amount: 30 });
      rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
    });

    describe("and the transaction data is valid", () => {
      it("returns true", () => {
        newBlockchain.addBlock({ data: [transaction, rewardTransaction] });
        expect(blockchain.validTransactionData({ chain: newBlockchain.chain })).toBe(true);

        expect(errorMock).not.toHaveBeenCalled();
      });
    });
    describe("and the transaction data has multiple rewards", () => {
      it("returns false and logs an error", () => {
        newBlockchain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction] });
        expect(blockchain.validTransactionData({ chain: newBlockchain.chain })).toBe(false);

        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("and the transaction data has at least one malformed outputMap", () => {
      describe("and the transaction is not a reward transaction", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[wallet.publicKey] = 33333333;
          newBlockchain.addBlock({ data: [transaction, rewardTransaction] });
          expect(blockchain.validTransactionData({ chain: newBlockchain.chain })).toBe(false);

          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the transaction is a reward transaction", () => {
        it("returns false and logs an error", () => {
          rewardTransaction.outputMap[wallet.publicKey] = Number.MAX_VALUE;
          newBlockchain.addBlock({ data: [transaction, rewardTransaction] });
          expect(blockchain.validTransactionData({ chain: newBlockchain.chain })).toBe(false);

          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    describe("and the transaction data has at least one malformed input", () => {
      it("returns false and logs an error", () => {
        wallet.balance = 8000;

        const fakeOutputMap = {
          [wallet.publicKey]: 7900,
          fakeRecipient: 100,
        };

        const fakeTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(fakeOutputMap),
          },
          outputMap: fakeOutputMap,
        };
        newBlockchain.addBlock({ data: [fakeTransaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newBlockchain.chain })).toBe(false);

        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("and a block multiple identical transactions", () => {
      it("returns false and logs an error", () => {
        newBlockchain.addBlock({ data: [transaction, transaction, transaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newBlockchain.chain })).toBe(false);

        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
