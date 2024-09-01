import bunyan from "bunyan";
// Load package.json

// Get some meta info from the package.json
const serviceName = "payment-service";
const version = "v1";

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) =>
  bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

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

export default config;
