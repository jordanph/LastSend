pragma solidity >=0.4.21 <0.6.0;

contract LastSend {
  address payable public lastSender;
  uint public expiryBlockNumber;
  bool public claimed;
  uint public finalBalance;

  event LastSenderUpdated(address lastSender, uint expiryBlockNumber, uint bounty);

  constructor() public {
    expiryBlockNumber = block.number + 5000;
    claimed = false;
  }

  function send() public payable {
    require(msg.value >= 10 ether, "Not enough VET sent. Requires at least 10.");
    require(expiryBlockNumber > block.number, "Send game has ended.");

    lastSender = msg.sender;
    expiryBlockNumber = block.number + 5000;

    emit LastSenderUpdated(lastSender, expiryBlockNumber, address(this).balance);
  }

  function withdraw() public {
    require(expiryBlockNumber <= block.number, "Send game has not ended yet.");
    require(msg.sender == lastSender, "Only the winner can withdraw their winnings.");
    require(claimed == false, "You already claimed your winnings.");

    claimed = true;
    finalBalance = address(this).balance;
    lastSender.transfer(address(this).balance);
  }
}