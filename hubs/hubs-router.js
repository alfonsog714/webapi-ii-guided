// const router = require("express").Router(); one way of requiring the router

const express = require("express");
const router = express.Router();
const Hubs = require("./hubs-model.js");

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const hubs = await Hubs.find(req.query);
    res.status(200).json(hubs);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the hubs"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hub = await Hubs.findById(req.params.id);

    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "Hub not found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the hub"
    });
  }
});

// POST /api/hubs
router.post("/", async (req, res) => {
  try {
    const hub = await Hubs.add(req.body);
    res.status(201).json(hub);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error adding the hub"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await Hubs.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The hub has been nuked" });
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error removing the hub"
    });
  }
});

// PUT /api/hubs/:id
router.put("/:id", async (req, res) => {
  try {
    const hub = await Hubs.update(req.params.id, req.body);
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error updating the hub"
    });
  }
});

// add an endpoint that returns all the messages for a hub
router.get("/:id/messages", async (req, res) => {
  console.log("hit");
  const { id } = req.params;

  try {
    const messages = await Hubs.findHubMessages(id);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error retrieving the messages related to the hub with an id of " + id
    });
  }
});

// add an endpoint that adds a new message to a hub
// test it with { hub_id: 1, sender: "me", text: "you pick a text"}
router.post("/:id/messages", async (req, res) => {
  if (!isValidMessage(req.body)) {
    res.status(400).json({ message: `No sender and/or text!` }); // either set a return here, or make an else statement
  } else {
    Hubs.addMessage(req.body) // can also do something like {hub_id: req.params.id, ...req.body}
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

isValidMessage = message => {
  const { sender, text, hub_id } = message;
  return sender && text && hub_id;
};

module.exports = router;
