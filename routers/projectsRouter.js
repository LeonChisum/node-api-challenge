const express = require("express");

const router = express.Router();

const projectsDb = require("../data/helpers/projectModel");

// PROJECT ROUTES

// POSTing a new project
router.post("/", validateProject, (req, res) => {
  projectsDb
    .insert(req.body)
    .then(project => res.status(201).json(project))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not save project" });
    });
});

// GETting all projects
router.get("/", (req, res) => {
  projectsDb
    .get()
    .then(projects => res.status(200).json(projects))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not retrieve projectss" });
    });
});

// GETting a specfic project
router.get("/:id", validateProjectId, (req, res) => {
  projectDb
    .get(id)
    .then(project => res.status(200).json(project))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Could not get project"
      });
    });
});

// GETting a specific project's actions
router.get("/:id/posts", validateProjectId, (req, res) => {
  projectsDb
    .getProjectActions(req.params.id)
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not retrieve project's actions" });
    });
});

// DELETing a specific project
router.delete("/:id", validateProjectId, (req, res) => {
  projectsDb
    .remove(req.params.id)
    .then(num => {
      res.status(200);
      console.log(`You've deleted ${num} project(s)`);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not remove project" });
    });
});

// PUTting a updated project
router.put("/:id", validateProject, (req, res) => {
  projectsDb
    .update(req.params.id, req.body)
    .then(project => res.status(200).json(project))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not update project" });
    });
});

//custom middleware

function validateProject(req, res, next) {
  const body = req.body;
  const name = body.name;
  const description = body.description;

  if (!body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!name) {
    res.status(400).json({ message: "missing required name field" });
  } else if (!description) {
    res.status(400).json({ message: "missing required description field" });
  } else {
    next();
  }
}

function validateProjectId(req, res, next) {
  const id = req.params.id;

  projectsDb
    .get(id)
    .then(project => {
      if (project) {
        // attach value to my request
        req.body = project;

        // moving to next middleware in call stack
        next();
      } else {
        res.status(400).json({ message: "invalid project id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Could not make request"
      });
    });
}
