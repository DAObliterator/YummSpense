const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const { listOrders } = require("./utils/gmailConfig.js");

dotenv.config({ path: path.join(__dirname, "./config.env") });

app.get("/", (req, res) => {
  res.send("Welcome to YummSpense server");
});

app.get("/getLabels", async (req, res) => {
  console.log(`/getLabels hit with a get request \n`);
  try {
    const orders = await listOrders();
    res.status(200).json({ data: orders });
  } catch (err) {
    console.error("Error fetching labels:", err);
    res.status(500).json({ error: "Failed to fetch labels" });
  }
});

const PORT = process.env.PORT || 6015;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} \n`);
});
