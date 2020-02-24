const express = require("express");

const router = express.Router();

const actionsDb = require("../data/helpers/actionModel");

// ACTION ROUTES

// POSTing a new action
router.post("/", validateAction, (req, res) => {
  actionsDb
    .insert({
        ...req.body,
        project_id: parseInt(req.params.projectId)
    })
    .then(action => res.status(201).json(action))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not save action" });
    });
});

// GETting all actions
router.get("/", (req, res) => {
  actionsDb
    .get()
    .then(action => res.status(200).json(action))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not retrieve projectss" });
    });
});

// GETting a specfic action
router.get("/:id", validateActionId, (req, res) => {
  actionsDb
    .get(req.param.id)
    .then(action => res.status(200).json(action))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Could not get action"
      });
    });
});

// DELETing a specific action
router.delete("/:id", validateActionId, (req, res) => {
  actionsDb
    .remove(req.params.id)
    .then(num => {
      res.status(200);
      console.log(`You've deleted ${num} action(s)`);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not remove action" });
    });
});

// PUTting a updated action
router.put("/:id", validateAction, (req, res) => {
  actionsDb
    .update(req.params.projectId, {
        ...req.body,
        project_id: parseInt(req.params.projectId)
    })
    .then(action => res.status(200).json(action))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not update action" });
    });
});

//custom middleware

function validateAction(req, res, next) {
  const body = req.body;
  const notes = body.notes;
  const description = body.description;

  if (!body) {
    res.status(400).json({ message: "missing action data" });
  } else if (!notes) {
    res.status(400).json({ message: "missing required notes field" });
  } else if (!description) {
    res.status(400).json({ message: "missing required description field" });
  }  else {
    next();
  }
}

function validateActionId(req, res, next) {
  const id = req.params.id;

  actionsDb
    .get(id)
    .then(action => {
      if (action) {
        // attach value to my request
        req.body = action;

        // moving to next middleware in call stack
        next();
      } else {
        res.status(400).json({ message: "invalid action id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Could not make request"
      });
    });
}

module.exports = router;
