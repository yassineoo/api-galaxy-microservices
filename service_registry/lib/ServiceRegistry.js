const winston = require("winston");

const logger = winston.createLogger({
	level: "debug",
	format: winston.format.simple(),
	transports: [new winston.transports.Console()],
});

class ServiceRegistry {
	constructor(log) {
		this.log = log || logger;
		this.services = {};
		this.timeout = 100000;
	}

	get(name, version) {
		this.cleanup();
		const serviceList = Object.values(this.services).filter(
			(service) => service.name === name && service.version == version
		);

		return serviceList[Math.floor(Math.random() * serviceList.length)];
	}

	register(name, version, ip, port) {
		this.cleanup();
		const key = name + version + ip + port;

		if (!this.services[key]) {
			this.services[key] = {};
			this.services[key].timestamp = Math.floor(new Date() / 1000);
			this.services[key].ip = ip;
			this.services[key].port = port;
			this.services[key].name = name;
			this.services[key].version = version;
			this.log.debug(
				`Added service ${name}, version ${version} at ${ip}:${port}`
			);
			return key;
		}

		this.services[key].timestamp = Math.floor(new Date() / 1000);
		this.log.debug(
			`Updated service ${name}, version ${version} at ${ip}:${port}`
		);
		return key;
	}

	unregister(name, version, ip, port) {
		const key = name + version + ip + port;
		delete this.services[key];
		this.log.debug(
			`Unregistered service ${name}, version ${version} at ${ip}:${port}`
		);
		return key;
	}

	cleanup() {
		const now = Math.floor(new Date() / 1000);
		Object.keys(this.services).forEach((key) => {
			if (this.services[key].timestamp + this.timeout < now) {
				delete this.services[key];
				this.log.debug(`Removed service ${key}`);
			}
		});
	}
}

module.exports = ServiceRegistry;
