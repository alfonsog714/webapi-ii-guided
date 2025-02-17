const express = require("express");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

server.get("/", (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

server.use("/api/hubs", hubsRouter); // Because we have /api/hubs here, we don't need to use that url in the endpoints within the hubs-router file

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

server.listen(4000, () => {
  console.log("\n*** Server Running on http://localhost:4000 ***\n");
});
