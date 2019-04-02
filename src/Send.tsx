import React, { useState } from 'react';

const sendABI = {
  "constant": false,
  "inputs": [],
  "name": "send",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function",
  "signature": "0xb46300ec"
};

const account = "0x2008795b014eA4931AfFa3357461B2696f1d1B64"

const Send = () => {
  const [sent, setSent] = useState<boolean>(false);

  const onClick = async () => {
    const signingService = connex.vendor.sign('tx');

    const sendClause = connex.thor.account(account).method(sendABI).value('1000000000000000000').asClause()

    await signingService.request([{...sendClause}]);

    setSent(true);
  }

  return (
    <div>
      {!sent && <button onClick={onClick}>Send</button>}
      {sent && "Sent!"}
    </div>
  )
}

export default Send;