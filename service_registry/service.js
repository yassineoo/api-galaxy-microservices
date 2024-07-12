const express = require("express");
const service = express();
const ServiceRegistry = require("./lib/ServiceRegistry");

const PORT = 3001;

const serviceRegisrty = new ServiceRegistry();

// This microservice will register the services available
service.put(
	"/register/:servicename/:serviceversion/:serviceport",
	(req, res) => {
		const { servicename, serviceversion, serviceport } = req.params;

		const serviceip = req.socket.remoteAddress.includes("::")
			? `[${req.socket.remoteAddress}]`
			: req.socket.remoteAddress;

		const serviceKey = serviceRegisrty.register(
			servicename,
			serviceversion,
			serviceip,
			serviceport
		);

		return res.json({ result: serviceKey });
	}
);

service.delete(
	"/unregister/:servicename/:serviceversion/:serviceport",
	(req, res) => {
		const { servicename, serviceversion, serviceport } = req.params;

		const serviceip = req.socket.remoteAddress.includes("::")
			? `[${req.socket.remoteAddress}]`
			: req.socket.remoteAddress;

		const serviceKey = serviceRegisrty.unregister(
			servicename,
			serviceversion,
			serviceip,
			serviceport
		);

		return res.json({ result: `Deleted ${serviceKey}` });
	}
);

service.get("/find/:servicename/:serviceversion", (req, res) => {
	const { servicename, serviceversion } = req.params;
	const svc = serviceRegisrty.get(servicename, serviceversion);
	if (!svc) return res.status(404).json({ result: "Service not found" });
	return res.json(svc);
});

// Start the server
service.listen(PORT, () => {
	console.log(`Service running on port ${PORT}`);
});
