const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const routes = require("./routes/routes");
require("./config/env");
require("./config/db");

const app = express();
const appUrl = process.env.APP_URL;

app.use(logger("dev"));
app.use(cors({ origin: appUrl }));

app.use("/api", routes);

module.exports = app;
