"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
// Load package.json
const pjs = require("../../package.json");
// Get some meta info from the package.json
const { name: serviceName, version } = pjs;
// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });
// Configuration options for different environments
const config = {
    development: {
        serviceName,
        version,
        serviceTimeout: 30,
        log: () => getLogger(serviceName, version, "debug"),
    },
    production: {
        serviceName,
        version,
        serviceTimeout: 30,
        log: () => getLogger(serviceName, version, "info"),
    },
    test: {
        serviceName,
        version,
        serviceTimeout: 30,
        log: () => getLogger(serviceName, version, "fatal"),
    },
};
exports.default = config;
