const config = require('./config');

if (config.isDevelopment) {
  module.exports = require('./webpack.dev.config');
} else {
  module.exports = require('./webpack.prod.config');
}