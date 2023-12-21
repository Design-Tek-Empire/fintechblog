"use strict";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path")
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./server/database/connection");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const initialize = require("./server/utils/passport");

// load config file
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDB();

const Port = process.env.PORT || 8080;

// load passport
initialize(passport);


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

// connect flash
app.use(flash());

app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);


// set global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});



// passport Middlewares
app.use(passport.initialize());
app.use(passport.session());



// load static files
app.use("/bcss",express.static(path.resolve(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/bjs",express.static(path.resolve(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/css", express.static(path.resolve(__dirname, "./public/css")));
app.use("/js", express.static(path.resolve(__dirname, "./public/js")));
app.use("/img", express.static(path.resolve(__dirname, "./public/img")));




// API EndPoints
app.use("/secure", require("./server/routes/authRoute")); // Auth Route
app.use("/", require("./server/routes/pageRoute")); // Page Routes



app.use((req, res) => {
  res.send("Page Not Found");
});








app.listen(Port, () => console.log(`http://localhost:${Port}`));
