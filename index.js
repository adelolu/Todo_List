const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
app.set("view engine", "ejs");
let errorMessage = "";
// app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

let tasks = [];

const todoSchema = mongoose.Schema({
  complete: { type: String, required: true },
  task: { type: String, required: true },
  content: { type: String, required: true },
});
const todomodel = mongoose.model("todo_collection", todoSchema);

app.get("/", async (req, res) => {
  let tasks = await todomodel.find({});
  res.render("index", { task: tasks, message: errorMessage });
});

app.get("/update/:id", async (req, res) => {
  let { id } = req.params;
  await todomodel
    .findOne({ _id: id })
    .then((edittask) => {
      res.render("edit", { task: edittask, id });
    })
    .catch((error) => {
      errorMessage = "There is an error";
      res.redirect("/");
    });
});

app.post("/upload", async (req, res) => {
  let { task, content } = req.body;
  let todo = { complete: false, task: task, content: content };
  await todomodel
    .create(todo)
    .then((addtodo) => {
      res.redirect("/");
    })
    .catch((error) => {
      errorMessage = "There is an error";
      res.redirect("/");
    });
});

app.post("/checked/:id", async (req, res) => {
  let { id } = req.params;

  let update;
  let task = await todomodel.findOne({ _id: id });
  if (task.complete) {
    update = false;
  } else {
    update = true;
  }

  await todomodel
    .findByIdAndUpdate({ _id: id }, { complete: update })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      errorMessage = "There is an error";
      res.redirect("/");
    });
});

app.post("/delete/:id", async (req, res) => {
  let { id } = req.params;
  await todomodel
    .deleteOne({ _id: id })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      errorMessage = "There is an error";
      res.redirect("/");
    });
});

app.post("/edit/:id", async (req, res) => {
  let { id } = req.params;
  let { task, content } = req.body;
  await todomodel
    .findByIdAndUpdate({ _id: id }, { task, content })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      errorMessage = "There is an error";
      res.redirect("/");
    });
});

port = 4000;
app.listen(port, () => {
  console.log("todo list started at " + port);
});

mongoose
  .connect(process.env.URI)
  .then((res) => {
    if (res) {
      console.log("connected to database");
    }
  })
  .catch((err) => {
    {
      errorMessage = "There is an error with connection to databse";
      res.redirect("/");
    }
  });
