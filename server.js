"use strict";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path")
const connectDB = require("./server/database/connection");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
const compression = require("compression");
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerJsDoc = YAML.load("./api.yaml") // Load the documentation file for swagger
const logger = require("./logger")



// load config file
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDB();

const Port = process.env.PORT || 8080;

// Gzip Compression
app.use(compression({
  level: 6,
}))


// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet())



// Configure Content Security Policy of helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://cdn.tailwindcss.com'],
      imgSrc: ["'self'", 'https://res.cloudinary.com'], // Allow images from Cloudinary
    },
  })
);



// load body parser
app.use(express.urlencoded({ extended: false }));



// Express file uploads configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 6 * 1024 * 1024 * 8, // 6mb max
    },
  })
);


app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 900000, // 15 minutes in milliseconds
    },
  })
);


// set global variables
app.use((req, res, next) => {
    res.locals.user = req.session.user
    next();
});

// set Logger globally
global.logger = logger





// load static files
app.use("/img", express.static(path.resolve(__dirname, "./public/img")));



// API EndPoints
app.use("/secure", require("./server/routes/authRoute")); // Auth Route
app.use("/posts", require("./server/routes/postRoute")) // Posts Route
app.use("/categories", require("./server/routes/categoryRoute")); // Category Route
app.use("/users", require("./server/routes/userRoute")) // User Route
app.use("/comments", require("./server/routes/commentRoute")) // Comments Route
app.use("/trades", require("./server/routes/tradeRoute"))
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc)) // Configure Swager documention 



app.use((req, res) => {
  res.send("Page Not Found");
});





app.listen(Port, () => console.log("server listening to port " + Port));
