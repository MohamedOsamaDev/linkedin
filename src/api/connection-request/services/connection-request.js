'use strict';

/**
 * connection-request service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::connection-request.connection-request');
