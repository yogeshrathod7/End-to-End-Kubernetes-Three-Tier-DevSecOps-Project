const tasks = require("./routes/tasks");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require('mongoose');

connection();

app.use(express.json());
app.use(cors());

// ALB root endpoint
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Health check endpoints
app.get('/healthz', (req, res) => {
    res.status(200).send('Healthy');
});

let lastReadyState = null;  
app.get('/ready', (req, res) => {
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

app.get('/started', (req, res) => {
    res.status(200).send('Started');
});

app.use("/api/tasks", tasks);

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Listening on port ${port}...`));
