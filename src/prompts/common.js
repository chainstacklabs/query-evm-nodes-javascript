const inquirer = require("inquirer");
const { getCurrentBlock } = require("../utils");
const {
  getCommonsSelection,
  processCommonsSelection,
} = require("./commonState");
const { getCustomSelection, processCustomSelection } = require("./custom");

let LATEST_BLOCK;

// Prompts the main selection panel
const getSelection = async () => {
  LATEST_BLOCK = await getCurrentBlock();
  const { mainOption } = await inquirer.prompt([
    {
      type: "list",
      name: "mainOption",
      message: "Select the type of functions to query",
      choices: [
        "Common state functions (getBalance, getBlock...)",
        "Custom contract state view functions",
      ],
    },
  ]);

  if (mainOption.includes("Common")) {
    // Process the common state query options
    const { commonsOption } = await getCommonsSelection();
    await processCommonsSelection(commonsOption);
  } else {
    // Process the custom contract state query options
    const { customOption, contractNames, contractInputs } =
      await getCustomSelection();
    await processCustomSelection(
      customOption,
      contractNames,
      contractInputs,
      LATEST_BLOCK
    );
  }
};

module.exports = {
  getSelection,
};
