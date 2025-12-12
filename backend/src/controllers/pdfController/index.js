// backend/src/controllers/pdfController/index.js
// Robust PDF generation based on pug templates.
// Ensures output directory exists, sets public file path default, and reports errors clearly.

const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
let pdf = require('html-pdf'); // existing dependency in your project
const { loadSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

/**
 * generatePdf
 * @param {string} modelName - name like 'invoice'
 * @param {object} info - { filename, format, targetLocation }
 * @param {object} result - the model data to render into the template
 * @param {function} callback - optional callback after PDF created (error-first)
 */
exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation, format = 'A5' } = info;

    if (!targetLocation) {
      const err = new Error('targetLocation is required for generatePdf');
      if (callback) return callback(err);
      throw err;
    }

    // Ensure folder exists
    const dir = path.dirname(targetLocation);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Delete existing file if present
    if (fs.existsSync(targetLocation)) {
      try {
        fs.unlinkSync(targetLocation);
      } catch (err) {
        // non-fatal; continue
        console.warn('Warning: unable to delete existing PDF: ', err.message);
      }
    }

    // Only render pug-supported models
    if (!pugFiles.includes(modelName.toLowerCase())) {
      const err = new Error(`No pug template registered for ${modelName}`);
      if (callback) return callback(err);
      throw err;
    }

    // Load settings (this project stores many settings in DB)
    const settings = await loadSettings();
    const selectedLang = settings['idurar_app_language'];
    const translate = useLanguage({ selectedLang });

    // Money/date utilities
    const {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    } = settings || {};

    const { moneyFormatter } = useMoney({
      settings: {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      },
    });

    const { dateFormat } = useDate({ settings: settings || {} });

    // Ensure public_server_file is defined, fallback to env or empty string
    settings.public_server_file = settings.public_server_file || process.env.PUBLIC_SERVER_FILE || '';

    // Render the HTML using the Pug template
    // Render the HTML using the Pug template
    const templatePath = path.join(__dirname, '../../pdf', `${modelName}.pug`);
    if (!fs.existsSync(templatePath)) {
      const err = new Error(`Pug template not found: ${templatePath}`);
      if (callback) return callback(err);
      throw err;
    }

    const htmlContent = pug.renderFile(templatePath, {
      model: result,
      settings,
      translate,
      dateFormat,
      moneyFormatter,
      moment,
    });

    // Create PDF (html-pdf)
    pdf
      .create(htmlContent, {
        format: format,
        orientation: 'portrait',
        border: '10mm',
      })
      .toFile(targetLocation, function (error, res) {
        if (error) {
          console.error('PDF creation failed:', error);
          if (callback) return callback(error);
          return;
        }
        if (callback) return callback(null, res);
      });
  } catch (error) {
    console.error('generatePdf error:', error);
    if (callback) return callback(error);
    throw error;
  }
};
