const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    `mongodb+srv://hadas:${process.env.MONGO_PASSWORD}@node-angular.rv87pjx.mongodb.net/?retryWrites=true&w=majority`
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

// GET all posts
app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts sent successfully",
      posts: documents,
    });
  });
});

// POST
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    console.log(createdPost);
    res
      .status(201)
      .json({ message: "post added successfully", postId: createdPost._id });
    // ^ added a property to update the id assigned by mongoose upon post creation
  });
});

// DELETE one
app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);

  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "deleted post" });
  });
});

module.exports = app;
