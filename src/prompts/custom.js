const inquirer = require("inquirer");
const {
  getContractCallMethods,
  ZERO_ADDRESS,
  callContractFunctionWithoutParams,
  callContractFunctionWithParams,
} = require("../utils");

/* Builds a new inquirer prompt for each required
    input for the selected smart contract method
*/
const buildPrompt = (inputs, latest_block) => {
  let prompts = [];
  inputs.forEach((input) => {
    prompts.push({
      type: "input",
      name: input.name,
      message: `Enter an ${input.type} for the ${input.name} to perform query`,
      default: getDefaultValue(input.type),
    });
  });

  prompts.push({
    type: "input",
    name: "block",
    message: `Enter the block number to perform query`,
    default: latest_block,
  });

  return prompts;
};

/* Gets the user inputs required to pass as function
    parameters in the method selected for the custom contract
*/
const getUserInput = async (inputs, latest_block) => {
  const prompt = buildPrompt(inputs, latest_block);

  const answer = await inquirer.prompt(prompt);

  const inputsAsArray = Object.keys(answer)
    .map((key) => answer[key])
    .slice(0, -1);
  const { block } = answer;

  return {
    userInput: inputsAsArray,
    block,
  };
};

/* Returns the default value of an inquirer prompt
    based on a smart contract function input type
*/
const getDefaultValue = (type) => {
  if (type.includes("address")) {
    return ZERO_ADDRESS;
  }

  if (type.includes("uint") || type.includes("int") || type.includes("enum")) {
    return 0;
  }

  if (type.includes("bool")) {
    return false;
  }

  if (type.includes("bytes")) {
    return "0x0";
  }

  if (type.includes("array")) return [];

  if (type.inclues("string")) return "";

  return null;
};

/* Returns the inputs name and type of a given method */
const getInputsOfMethod = (contractInputs, indexOf) => {
  return contractInputs[indexOf];
};

/* Returns the index of a method in the methods name array */
const getIndexOfMethod = (contractNames, method) => {
  return contractNames.findIndex((name) => name === method);
};

/* Returns the option selected to query on a custom
    smart contract. Also returns the contract methods names
    and their required inputs
*/
const getCustomSelection = async () => {
  const { contractNames, contractInputs } = getContractCallMethods();

  const { customOption } = await inquirer.prompt([
    {
      type: "list",
      name: "customOption",
      choices: contractNames,
      message: "Select a read-only function from your smart contract",
    },
  ]);

  return { customOption, contractNames, contractInputs };
};

/* Performs the selection process for a method
    on the smart contract to query
*/
const processCustomSelection = async (
  selection,
  contractNames,
  contractInputs,
  latest_block
) => {
  const indexOf = getIndexOfMethod(contractNames, selection);

  const methodInputs = getInputsOfMethod(contractInputs, indexOf);

  const { userInput, block } = await getUserInput(methodInputs, latest_block);

  if (methodInputs.length < 1) {
    callContractFunctionWithoutParams(selection, block);
  } else {
    await callContractFunctionWithParams(selection, userInput, block);
  }

  return;
};

module.exports = {
  getCustomSelection,
  processCustomSelection,
};
