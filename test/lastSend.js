const LastSend = artifacts.require("mocks/LastSend");
import truffleAssert from ('truffle-assertions');

contract("Last Send", async (accounts) => {
  let instance;
  const expiryBlockAmount = 46500;

  beforeEach(async () => {
    instance = await LastSend.deployed();
  });
  
  it("should set the initial expiry block to ~1 week (~46500 block)", async () => {
    const currentBlock = await web3.eth.getBlock('latest');

    const expiryBlockNumber = await instance.expiryBlockNumber();

    assert.equal(expiryBlockNumber.toNumber(), currentBlock.number + expiryBlockAmount);
  });

  describe("send", () => {
    const enoughEther = web3.utils.toWei('0.01', 'ether');

    describe("ether requirement", async () => {
      it("should fail if less than 0.01 ether is sent", async () => {
        const noEnoughEtherRequest = instance.send({ from: accounts[0], value: web3.utils.toWei('0.009', 'ether')});
  
        truffleAssert.reverts(noEnoughEtherRequest, 'Not enough Ether sent. Requires at least 0.01.');
      });

      it("should pass if 0.01 or more is sent", async () => {
        const enoughEtherRequest = instance.send({ from: accounts[0], value: enoughEther});
  
        truffleAssert.passes(enoughEtherRequest);
      });
    });


    it("requires that the game hasn't ended", async () => {
    });

    it("updates the current last address to the sender", async () => {
      const addressToSendFrom = accounts[1];
      await instance.send({ from: addressToSendFrom, value: enoughEther});

      const newCurrentAddress = await instance.lastSender();

      assert.equal(newCurrentAddress, addressToSendFrom);
    });

    it("increases the pool by the amount sent", async () => {
      const initialBalance = await web3.eth.getBalance(instance.address);
      const increaseAmount = web3.utils.toWei('0.01', 'ether');
      await instance.send({ from: accounts[0], value: increaseAmount});

      const updatedBalance = await web3.eth.getBalance(instance.address);

      const expectedAmount = new web3.utils.BN(initialBalance).add(new web3.utils.BN(increaseAmount));

      assert.equal(updatedBalance, expectedAmount);
    });

    it("updates the block expiry to a weeks time", async () => {
      const currentBlock = await web3.eth.getBlock('latest');

      await instance.send({ from: accounts[0], value: enoughEther});

      const newExpiryBlockNumber = await instance.expiryBlockNumber();
  
      assert.equal(newExpiryBlockNumber.toNumber(), (currentBlock.number + 1) + expiryBlockAmount);
    });

    it("emits the updated player, new expiry block and amount of ether in contract", async () => {
    });
  });

  describe("ended", () => {
    it("should return false while end time hasn't been reached", async () => {
      const ended = await instance.ended();
  
      assert.equal(ended, false);
    });

    it("should return true if end time has been reached", async () => {
      await instance.setBlockNumber.call(1000000);

      const blockNumber = await instance.blockNumber();

      console.log(blockNumber.toNumber());

      const ended = await instance.ended();
  
      assert.equal(ended, true);
    });
  });

  describe("withdraw", () => {
    it("should not complete if the game hasn't ended", () => {
      const gameNotEnded = instance.withdraw({ from: accounts[0] });
  
      truffleAssert.reverts(gameNotEnded, "Send game has not ended yet.");
    });

    it("should not complete if the sender is not the winner", async () => {
      const winner = accounts[1];
      const nonWinner = accounts[0];

      await instance.send({ from: winner, value: winnerSendAmount });

      const notWinnerWithdrawing = instance.withdraw({ from: nonWinner });

      truffleAssert.reverts(notWinnerWithdrawing, "Only the winner can withdraw their winnings.");
    });

    it("should not complete if the sender has already withdrawn", async () => {
      const winner = accounts[1];

      await instance.send({ from: winner, value: winnerSendAmount });

      await instance.withdraw({ from: winner });

      const alreadyWithdrawn = instance.withdraw({ from: winner });

      truffleAssert.reverts(alreadyWithdrawn, "You already claimed your winnings.");
    });

    describe("when game is ended, sender is winner and amount not already withdrawn", async () => {
      const winner = accounts[1];
      const winnerSendAmount = web3.utils.toWei('1', 'ether')

      beforeEach( async () => {
        await instance.send({ from: winner, value: winnerSendAmount });
      });

      it("should transfer the ether to the sender/winner", async () => {
        const accountBalance = winner.balance;

        await instance.withdraw({ from: winner });

        assert.equal(winner.balance, accountBalance + winnerSendAmount);
      });

      it("should set claimed to true", async () => {
        await instance.withdraw({ from: winner });

        const claimed = await instance.claimed();

        assert.equal(claimed, true);
      });
    });
  });
});