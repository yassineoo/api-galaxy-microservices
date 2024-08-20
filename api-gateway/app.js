const express = require("express");
const app = express();
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");

const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(cors({ origin: true, credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

async function fetchServiceUrlFromRegistry(servicename, serviceversion) {
  try {
    const response = await axios.get(
      //   `http://localhost:3001/find/${servicename}/${serviceversion}`
      `http://service-registry:3001/find/${servicename}/${serviceversion}`
    );
    return response.data; // Assuming the response is a single service URL
  } catch (error) {
    return null;
  }
}

// Define the list of services
const services = [
  { name: "auth-service", version: "v1", path: "/auth" },
  { name: "apis-service", version: "v1", path: "/apis-service" },
  {
    name: "notifications-service",
    version: "v1",
    path: "/notifications-service",
  },
  { name: "statistics-service", version: "v1", path: "/stats-service" },
  { name: "users", version: "v1", path: "/users" },
  { name: "notifications", version: "v1", path: "/notifications" },
  { name: "abonnements", version: "v1", path: "/abonnements" },
  { name: "paiements", version: "v1", path: "/paiements" },
  // Add more services as needed
];

async function createServiceProxy(service) {
  const serviceInfo = await fetchServiceUrlFromRegistry(
    service.name,
    service.version
  );
  if (serviceInfo) {
    //let serviceIp = serviceInfo.ip;
    let serviceIp = service.name;
    const port = serviceInfo.port !== ":8000" ? serviceInfo.port : "8000";

    // if (serviceIp === "[::1]") {
    //  serviceIp = "127.0.0.1";
    //  }
    console.log(`serviceIp: ${serviceIp}`, `port: ${port}`);

    const serviceUrl = `http://${serviceIp}:${port}`;
    const serviceProxy = createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: (path) => path, // Preserve the full path
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Forwarding request to: ${serviceUrl}${req.url}`);
      },
      onError: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
        res.status(500).send("Proxy Error");
      },
    });
    console.log(`Creating proxy for ${service.name} at ${serviceUrl}`);
    app.use(service.path, (req, res, next) => {
      console.log(
        `Incoming request to ${service.name}: ${req.method} ${req.url}`
      );
      serviceProxy(req, res, next);
    });
  } else {
    console.log(`Service ${service.name} not found in registry.`);
  }
}

// Dynamically create proxies for each service
async function createProxies() {
  for (const service of services) {
    await createServiceProxy(service);
  }
}

createProxies();

app.get("/services/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const serviceInfo = await fetchServiceUrlFromRegistry(name, "v1");
    if (serviceInfo) {
      const serviceUrl = `http://${serviceInfo.ip}:${serviceInfo.port}`;
      res.status(200).json(serviceUrl);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la photo depuis le service d'authentification :",
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la photo" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
