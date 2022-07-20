// Initial Config
const Web3 = require("web3");

// Init Full and Archive providers
const fullNodeProvider = new Web3(
  "https://nd-479-987-415.p2pify.com/271156373b36700f7576cf46e68b1262"
);
const archiveNodeProvider = new Web3(
  "https://nd-072-228-848.p2pify.com/3f7a80739e2f6739cae0256a2660725b"
);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Returns current block of a network
const getCurrentBlock = async () => {
  return await fullNodeProvider.eth.getBlockNumber();
};

// Checks if performed query needs to be called to an archive node
const isArchiveQuery = (error) => {
  return error.message.includes("missing trie node");
};

// Returns eth balance of a given address in a certain block
const getETHBalance = async (address, block) => {
  console.log(
    `[QUERYING] Fetching ETH balance from address ${address} at block ${block}`
  );
  try {
    console.log("[QUERYING] Attempting with Full Node");
    return await fullNodeProvider.eth.getBalance(address, block);
  } catch (error) {
    if (isArchiveQuery(error)) {
      console.log("[OLD-BLOCK-QUERY] Switching to archive query");
      return await archiveNodeProvider.eth.getBalance(address, block);
    }
    return null;
  }
};

// Returns the storage of an address at a given position
const getStorageAt = async (address, position, block) => {
  console.log(
    `[QUERYING] Fetching storage at position ${position} from address ${address} at block ${block}`
  );
  try {
    console.log("[QUERYING] Attempting with Full Node");
    return await fullNodeProvider.eth.getStorageAt(address, position, block);
  } catch (error) {
    if (isArchiveQuery(error)) {
      console.log("[OLD-BLOCK-QUERY] Switching to archive query");
      return await archiveNodeProvider.eth.getStorageAt(
        address,
        position,
        block
      );
    }
    return null;
  }
};

// Returns the code at a given address and block
const getCode = async (address, block) => {
  console.log(address);

  console.log(
    `[QUERYING] Fetching code at address ${address} at block ${block}`
  );
  try {
    console.log("[QUERYING] Attempting with Full Node");
    return await fullNodeProvider.eth.getCode(address, block);
  } catch (error) {
    if (isArchiveQuery(error)) {
      console.log("[OLD-BLOCK-QUERY] Switching to archive query");
      return await archiveNodeProvider.eth.getCode(address, block);
    }
    return null;
  }
};

// Returns all transactions mined in a block
const getBlockTransactions = async (block, full) => {
  console.log(`[QUERYING] Fetching block ${block} transactions`);
  try {
    console.log("[QUERYING] Attempting with Full Node");
    return await fullNodeProvider.eth.getBlock(block, full);
  } catch (error) {
    if (isArchiveQuery(error)) {
      console.log("[OLD-BLOCK-QUERY] Switching to archive query");
      return await archiveNodeProvider.eth.getBlock(block);
    }
    return null;
  }
};

// Prints the result of querying the ETH balance
// of an address at a given block
const printETHBalanceOf = async (address, block) => {
  const ethBalance = await getETHBalance(address, block);

  ethBalance === null
    ? console.log("Invalid query")
    : console.log(
        `[BALANCE-RESULTS] Eth balance of address ${address} at block ${block}: ${ethBalance} $ETH`
      );
};

// Prints the result of querying the storage at an address
// at a given position and block
const printStorageAt = async (address, block, position) => {
  const storageAt = await getStorageAt(address, position, block);

  storageAt === null
    ? console.log("Invalid query")
    : console.log(
        `[STORAGE-RESULTS] Storage at address ${address} at postion ${position} at block ${block}: ${storageAt}`
      );
};

// Prints the result of querying the code at a given
// address and block
const printCodeAt = async (address, block) => {
  const codeAt = await getCode(address, block);

  codeAt === null
    ? console.log("Invalid query")
    : console.log(
        `[CODE-RESULTS] Code at address ${address} at block ${block}: ${codeAt}`
      );
};

// Prints the block transactions of a given block
// If full is set to false, it will just print the transaction hashes
const printBlockTransactions = async (block, full) => {
  const blockTransactions = await getBlockTransactions(block, full);

  blockTransactions === null
    ? console.log("Invalid query")
    : console.log(
        `[TRANSACTIONS] Transactions at block ${block}: \n`,
        blockTransactions
      );
};

/* ############### Smart contract interactions ############### */
const { abi } = require("./abi");

// You can use your own contract address
const CONTRACT_ADDRESS = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE";

// Init instances of our contract both in the full and archive node providers
const fullNodeContract = new fullNodeProvider.eth.Contract(
  abi,
  CONTRACT_ADDRESS
);
const archiveNodeContract = new archiveNodeProvider.eth.Contract(
  abi,
  CONTRACT_ADDRESS
);

/* Returns the contracts methods that only query 
  a smart contract state and its inputs */
const getContractCallMethods = () => {
  let contractInputs = [];

  // The json interface array contains the methods metadata
  const contractNames = fullNodeContract._jsonInterface
    .filter((methodMetadata) => methodMetadata.stateMutability === "view")
    .map((method) => {
      contractInputs.push(method.inputs);
      return method.name;
    });

  return {
    contractNames,
    contractInputs,
  };
};

/* Calls a smart contract method that doesn't receive
  any parameters to return a smart contract state 
  
  selection: contains the method name selected with inquirer
  block: the block to query
*/
const callContractFunctionWithoutParams = async (selection, block) => {
  try {
    console.log(`[QUERYING] Calling ${selection} method on block ${block} `);
    const result = await fullNodeContract.methods[selection]().call(
      (defaultBlock = block)
    );
    console.log(
      `[${selection}-RESULT] Results from calling ${selection} method on block ${block}: `,
      result
    );
  } catch (error) {
    if (isArchiveQuery(error)) {
      console.log("[OLD-BLOCK-QUERY] Switching to archive query");
      const result = await archiveNodeContract.methods[selection]().call(
        (defaultBlock = block)
      );
      console.log(
        `[${selection}-RESULT] Results from calling ${selection} method on block ${block}: `,
        result
      );
    } else {
      console.error(error);
    }
  }
};

/* Calls a smart contract method that doesn't receive
  any parameters to return a smart contract state 
  
  selection: contains the method name selected with inquirer
  params: the smart contract function parameters
  block: the block to query
*/
const callContractFunctionWithParams = async (selection, params, block) => {
  try {
    console.log(`[QUERYING] Calling ${selection} method on block ${block} `);

    const result = await fullNodeContract.methods[selection](...params).call(
      (defaultBlock = block)
    );
    console.log(
      `[${selection}-RESULT] Results from calling ${selection} method on block ${block}: `,
      result
    );
  } catch (error) {
    if (isArchiveQuery(error)) {
      console.log("[OLD-BLOCK-QUERY] Switching to archive query");
      const result = await archiveNodeContract.methods[selection](
        ...params
      ).call((defaultBlock = block));
      console.log(
        `[${selection}-RESULT] Results from calling ${selection} method on block ${block}: `,
        result
      );
    } else {
      console.error(error);
    }
  }
};

module.exports = {
  getCurrentBlock,
  getETHBalance,
  getStorageAt,
  getCode,
  getBlockTransactions,
  getContractCallMethods,
  printETHBalanceOf,
  printCodeAt,
  printStorageAt,
  printBlockTransactions,
  callContractFunctionWithoutParams,
  callContractFunctionWithParams,
  ZERO_ADDRESS,
};
