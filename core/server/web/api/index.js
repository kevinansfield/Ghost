const debug = require('ghost-ignition').debug('web:api:default:app');
const express = require('express');
const urlUtils = require('../../lib/url-utils');
const shared = require('../shared');

module.exports = function setupApiApp() {
    debug('Parent API setup start');
    const apiApp = express();

    // do not serve any API requests on a separated front-end url
    apiApp.use(shared.middlewares.keepAdminSeparate);

    // Mount different API versions
    apiApp.use(urlUtils.getVersionPath({version: 'v0.1'}), require('./v0.1/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v2', type: 'content'}), require('./v2/content/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v2', type: 'admin'}), require('./v2/admin/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v2', type: 'members'}), require('./v2/members/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v3', type: 'content'}), require('./canary/content/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v3', type: 'admin'}), require('./canary/admin/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v3', type: 'members'}), require('./canary/members/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'canary', type: 'content'}), require('./canary/content/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'canary', type: 'admin'}), require('./canary/admin/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'canary', type: 'members'}), require('./canary/members/app')());

    // Error handling for requests to non-existent API versions
    apiApp.use(shared.middlewares.errorHandler.resourceNotFound);
    apiApp.use(shared.middlewares.errorHandler.handleJSONResponse);

    debug('Parent API setup end');
    return apiApp;
};
