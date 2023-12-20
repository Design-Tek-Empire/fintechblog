"use strict";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path")
const expressLayouts = require("express-ejs-layouts");


// load config file
dotenv.config({ path: "./config/config.env" });

const Port = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet())


// set view engine
app.use(expressLayouts);
app.set("layout", "../layouts/layout");
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views/pages"));


// load body parser
app.use(express.urlencoded({ extended: false }));


// set global variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


// load static files
app.use("/bcss",express.static(path.resolve(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/bjs",express.static(path.resolve(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/css", express.static(path.resolve(__dirname, "./public/css")));
app.use("/js", express.static(path.resolve(__dirname, "./public/js")));
app.use("/img", express.static(path.resolve(__dirname, "./public/img")));



app.get("/", (req, res) => {
  res.send("Hello");
});




app.listen(Port, () => console.log(`http://localhost:${Port}`));
