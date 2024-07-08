const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const { log } = require("console");
app.set("view engine", "ejs");

// app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// let tasks = ['a','b', 'c']
let tasks = [];

// const userSchema
app.get("/", (req, res) => {
  res.render("index", { task: tasks });
});
app.get("/update/:index", (req, res) => {
  let index = req.params.index;
  let edittask = tasks[index];
  res.render("edit", { task: edittask, index });
});

app.post("/upload", (req, res) => {
  let { task, content } = req.body;
  if (task != "") {
    tasks.push({ complete: false, task: task, content: content });
  }
  res.redirect("/");
});

app.post("/checked/:index", (req, res) => {
  let index = req.params.index;
  tasks.forEach((element, i) => {
    if (index == i && !element.complete) {
      element.complete = true;
    } else {
      element.complete = false;
    }
  });
  res.redirect("/");
});

app.post("/delete/:index", (req, res) => {
  let index = req.params.index;
  tasks.splice(index, 1);
  res.redirect("/");
});

app.post("/edit/:index", (req, res) => {
  let index = req.params.index;
  let { task, content } = req.body;
  console.log(req.body);
  tasks[index].task = task;
  tasks[index].content = content;
  res.redirect("/");
});

port = 4000;
app.listen(port, () => {
  console.log("todo list started");
});

mongoose
  .connect(process.env.URI)
  .then((res) => {
    if (res) {
      console.log("connected to database");
    }
  })
  .catch((err) => {
    console.log(err);
  });
