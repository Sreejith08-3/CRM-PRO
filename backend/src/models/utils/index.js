// Hardcoded model lists for Vercel compatibility
// This avoids using globSync which fails in serverless environments

const modelsFiles = [
  'Admin',
  'AdminPassword',
  'Setting',
  'Upload',
  'Client',
  'Invoice',
  'Payment',
  'PaymentMode',
  'Quote',
  'Taxes'
];

const appModelsList = [
  'Client',
  'Invoice',
  'Payment',
  'PaymentMode',
  'Quote',
  'Taxes'
];

const entityList = appModelsList.map(model => model.toLowerCase());

const routesList = appModelsList.map(modelName => {
  const firstChar = modelName.charAt(0);
  const fileNameLowerCaseFirstChar = modelName.replace(firstChar, firstChar.toLowerCase());
  return {
    entity: modelName.toLowerCase(),
    modelName: modelName,
    controllerName: fileNameLowerCaseFirstChar + 'Controller',
  };
});

const constrollersList = routesList.map(r => r.controllerName);

module.exports = { constrollersList, appModelsList, modelsFiles, entityList, routesList };
