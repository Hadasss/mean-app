const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    `mongodb+srv://hadas:${process.env.MONGO_PASSWORD}@cluster0.rv87pjx.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save();
  res.status(201).json({ message: "post added successfully" });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "k238o9dhg",
      title: "First server side post",
      content: "This is coming from th server!",
    },
    {
      id: "ls343459fs",
      title: "Second server side post",
      content: "This is also coming from th server!",
    },
  ];
  res.status(200).json({
    message: "Posts sent successfully",
    posts: posts,
  });
});

module.exports = app;
