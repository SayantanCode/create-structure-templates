const { createServer } = require("../app.js");
// __COMPOSER_IMPORTS__

// Connects every external resource (database, cache, queue, ...) in
// sequence before the app is created, so a request can never arrive
// before its dependencies are ready. Nothing to add here if you didn't
// pick a module that needs one — an empty step list is a no-op, this file
// just calls straight through to createServer(). If you add your own
// dependency later, follow the same shape a database module already
// contributes: a require above, an awaited step below.
async function loadApp() {
  // __COMPOSER_LOADER_STEPS__

  return createServer();
}

module.exports = { loadApp };
