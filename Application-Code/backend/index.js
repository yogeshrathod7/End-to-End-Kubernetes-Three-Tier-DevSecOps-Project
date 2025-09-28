const tasks = require("./routes/tasks");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
connection();

app.use(express.json());
app.use(cors());

// ✅ Health check endpoints (aligned with Ingress paths)

// Basic health check to see if the server is running
app.get('/api/healthz', (req, res) => {
    res.status(200).send('Healthy');
});

let lastReadyState = null;
// Readiness check to see if the server is ready to serve requests
app.get('/api/ready', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected !== lastReadyState) {
        console.log(`Database readyState: ${mongoose.connection.readyState}`);
        lastReadyState = isDbConnected;
    }

    if (isDbConnected) {
        res.status(200).send('Ready');
    } else {
        res.status(503).send('Not Ready');
    }
});

// Startup check to ensure the server has started correctly
app.get('/api/started', (req, res) => {
    res.status(200).send('Started');
});

// ✅ Task routes
app.use("/api/tasks", tasks);

// ✅ Start server
const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Listening on port ${port}...`));
