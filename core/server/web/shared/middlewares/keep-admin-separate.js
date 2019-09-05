const url = require('url');
const {URL} = url;
const common = require('../../../lib/common');
const urlUtils = require('../../../lib/url-utils');

// returns a 404 for requests to the wrong url when front-end and admin are separated
module.exports = function keepAdminSeparate(req, res, next) {
    const siteUrl = new URL(urlUtils.urlFor('home', true));
    const adminUrl = new URL(urlUtils.urlFor('admin', true));

    // if no separate admin url is configured let all requests through
    if (siteUrl.host === adminUrl.host && siteUrl.protocol === adminUrl.protocol) {
        console.log('no separate admin url, you may pass');
        return next();
    }

    const requestedHost = req.get('host');
    const requestedPath = url.parse(req.originalUrl || req.url).pathname;

    const isAdminHostRequest = requestedHost === adminUrl.host;
    const isFrontendHostRequest = !isAdminHostRequest;

    // TODO: update to work with subdirs (both frontend and admin)
    const isAdminPathRequest = requestedPath.startsWith('/ghost/');
    const isAdminHomePathRequest = requestedPath === '/ghost/';
    const isContentPathRequest = requestedPath.startsWith('/content/') || requestedPath.startsWith('/public/');

    console.log({requestedHost, requestedPath, isAdminHostRequest, isFrontendHostRequest, isAdminPathRequest, isContentPathRequest});

    // block any admin requests coming in to the front-end url
    if (isFrontendHostRequest && isAdminPathRequest && !isAdminHomePathRequest) {
        console.log('admin request on front-end url, you shall not pass');
        return next(new common.errors.NotFoundError({
            message: common.i18n.t('errors.errors.pageNotFound'),
            code: 'ADMIN_ACCESS_ON_FRONTEND'
        }));
    }

    // block any front-end requests coming in to the admin url
    if (isAdminHostRequest && !isAdminPathRequest && !isContentPathRequest) {
        console.log('front-end request on admin url, you shall not pass');
        return next(new common.errors.NotFoundError({
            message: common.i18n.t('errors.errors.pageNotFound'),
            code: 'FRONTEND_ACCESS_ON_ADMIN'
        }));
    }

    next();
};
