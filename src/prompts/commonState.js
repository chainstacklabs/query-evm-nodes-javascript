const inquirer = require("inquirer");
const {
  printETHBalanceOf,
  printCodeAt,
  printStorageAt,
  getCurrentBlock,
  printBlockTransactions,
  ZERO_ADDRESS,
} = require("../utils");

// Builds a prompt for block input
const blockPrompt = () => ({
  type: "input",
  default: LATEST_BLOCK,
  name: "block",
  message:
    "Enter the block number to perform the query (blank to use latest block)",
});

// Builds a prompt for address input
const addressPrompt = () => ({
  type: "input",
  default: ZERO_ADDRESS,
  name: "address",
  message: "Enter an address to perfom the query (blank to use zero address)",
});

/* Prompts the inputs for the block to query
  and select if go full details or just the hashes
*/
const getBlockFull = async () => {
  LATEST_BLOCK = await getCurrentBlock();
  return await inquirer.prompt([
    blockPrompt(),
    {
      type: "confirm",
      default: false,
      name: "full",
      message: "Do you wish to get the full transactions output?",
    },
  ]);
};

/* Prompts the inputs for the block
  and the address to perform a query
*/
const getAddressBlock = async () => {
  LATEST_BLOCK = await getCurrentBlock();
  return await inquirer.prompt([addressPrompt(), blockPrompt()]);
};

/* Prompts the inputs for the block, address
  and the position to perform a query
*/
const getAddressBlockPosition = async () => {
  LATEST_BLOCK = await getCurrentBlock();
  return await inquirer.prompt([
    addressPrompt(),
    blockPrompt(),
    {
      type: "input",
      name: "position",
      message:
        "Enter the position of the storage to perform the query (default 0)",
      default: 0,
    },
  ]);
};

// Performs query for getting ETH balance
const processETHBalance = async () => {
  const { address, block } = await getAddressBlock();
  await printETHBalanceOf(address, block);

  return;
};

// Performs query for getting code at given address
const processCodeAt = async () => {
  const { address, block } = await getAddressBlock();
  await printCodeAt(address, block);

  return;
};

// Performs query for getting storage at an address
// at a given position
const processStorageAt = async () => {
  const { address, block, position } = await getAddressBlockPosition();
  await printStorageAt(address, block, position);

  return;
};

// // Performs query for getting a block transactions
const processTransactions = async () => {
  const { block, full } = await getBlockFull();
  await printBlockTransactions(block, full);

  return;
};

// Prompts the option to select the common state
// query function to call
const getCommonsSelection = async () => {
  return await inquirer.prompt([
    {
      type: "list",
      name: "commonsOption",
      choices: [
        "Get ETH balance of an address at a given block",
        "Get storage at an address at a given position and block",
        "Get code of an address at a given block",
        "Get block transactions from a given block",
      ],
    },
  ]);
};

// Executes the method select on CLI
const processCommonsSelection = async (selection) => {
  if (selection.includes("balance")) {
    await processETHBalance();
    return;
  }

  if (selection.includes("code")) {
    await processCodeAt();
    return;
  }

  if (selection.includes("storage")) {
    await processStorageAt();
    return;
  }

  if (selection.includes("transactions")) {
    await processTransactions();
    return;
  }
};

module.exports = {
  getCommonsSelection,
  processCommonsSelection,
};
