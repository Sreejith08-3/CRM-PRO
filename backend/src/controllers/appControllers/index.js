const createCRUDController = require('../middlewaresControllers/createCRUDController');
const { routesList } = require('../../models/utils');

const appControllers = () => {
  const controllers = {};
  const hasCustomControllers = [];

  // Explicitly load custom controllers to ensure Vercel bundles them
  const customControllersList = {
    clientController: require('./clientController'),
    invoiceController: require('./invoiceController'),
    paymentController: require('./paymentController'),
    paymentModeController: require('./paymentModeController'),
    quoteController: require('./quoteController'),
    taxesController: require('./taxesController'),
  };

  for (const [controllerName, controller] of Object.entries(customControllersList)) {
    if (controller) {
      hasCustomControllers.push(controllerName);
      controllers[controllerName] = controller;
    }
  }

  routesList.forEach(({ modelName, controllerName }) => {
    if (!hasCustomControllers.includes(controllerName)) {
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

module.exports = appControllers();
