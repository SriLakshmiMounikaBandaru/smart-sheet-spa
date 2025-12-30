import { HyperFormula } from 'hyperformula';

// Initialize HyperFormula with a license key
const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3', // Use 'gpl-v3' for open-source projects
});

// Function to safely add custom functions
const addCustomFunctions = (hf) => {
  if (hf.addFunction) {
    hf.addFunction(
      'FULLNAME',
      (first, last) => `${first} ${last}`,
      { isVolatile: false }
    );
  } else {
    console.error("HyperFormula's addFunction is not available.");
  }
};

addCustomFunctions(hfInstance);

export default hfInstance;
