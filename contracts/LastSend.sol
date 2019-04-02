pragma solidity >=0.4.21 <0.6.0;

contract LastSend {
  address payable public lastSender;
  uint public expiryBlockNumber;
  bool public claimed;

  event LastSenderUpdated(address lastSender, uint expiryBlockNumber, uint bounty);

  constructor() public {
    expiryBlockNumber = block.number + 5000;
    claimed = false;
  }

  function blockNumber() public view returns (uint) {
    block.number;
  }

  function send() public payable {
    require(msg.value >= 10 ether, "Not enough VET sent. Requires at least 10.");
    require(expiryBlockNumber > block.number, "Send game has ended.");

    lastSender = msg.sender;
    expiryBlockNumber = block.number + 5000;

    emit LastSenderUpdated(lastSender, expiryBlockNumber, address(this).balance);
  }

  function ended() public view returns (bool) {
    expiryBlockNumber <= block.number;
  }

  function withdraw() public {
    require(expiryBlockNumber <= block.number, "Send game has not ended yet.");
    require(msg.sender == lastSender, "Only the winner can withdraw their winnings.");
    require(claimed == false, "You already claimed your winnings.");

    claimed = true;
    lastSender.transfer(address(this).balance);
  }
}