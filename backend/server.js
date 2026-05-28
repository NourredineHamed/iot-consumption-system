const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const controller = require("./controller/consommationController");
const dataStore = require("./store/dataStore");

//////////////////////////////
// CONFIG
//////////////////////////////
const MAX_LOGS = 200;

//////////////////////////////
// STATE (ONLY LOGS + SSE)
//////////////////////////////
const logs = [];
const sseClients = new Set();

//////////////////////////////
// PUSH LOG FUNCTION (SSE)
//////////////////////////////
function pushLog(entry) {
  logs.push(entry);

  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  const payload = `data: ${JSON.stringify(entry)}\n\n`;

  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      // ignore broken connections
    }
  }
}

//////////////////////////////
// LATEST DATA (from dataStore ONLY)
//////////////////////////////
app.get("/consommation/latest", (req, res) => {
  const last = dataStore.getLastData();

  if (!last) {
    return res.status(204).json({});
  }

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  res.json(last);
});

//////////////////////////////
// NORMAL API (frontend use)
//////////////////////////////
app.get("/consommation/:type", controller.getConsommation);

//////////////////////////////
// LOGS API
//////////////////////////////
app.get("/logs", (req, res) => {
  res.json(logs);
});

//////////////////////////////
// SSE STREAM (REAL TIME LOGS)
//////////////////////////////
app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(": connected\n\n");

  sseClients.add(res);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

//////////////////////////////
// ESP32 DATA RECEIVER
//////////////////////////////
app.post("/data", (req, res) => {

  const body = req.body;

  // basic validation
  if (!body || body.eau === undefined || body.electricite === undefined) {
    return res.status(400).json({
      error: "Invalid ESP32 payload"
    });
  }

  const entry = {
    timestamp: new Date().toISOString(),
    data: body
  };

  console.log(
    `[${entry.timestamp}] ESP32 -> eau=${body.eau} electricite=${body.electricite}`
  );

  // SINGLE SOURCE OF TRUTH
  dataStore.setLastData(body);

  pushLog(entry);

  res.json({ status: "ok" });
});

//////////////////////////////
// START SERVER
//////////////////////////////
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur port ${PORT}`);
});