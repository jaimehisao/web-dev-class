// NPM IMPORTS //
const express = require("express");
const database = require("./database");
// EXPRESS PACKAGES //
const expressHandlebars = require("express-handlebars");
const expressSession = require("express-session");

// DECLARATION OF EXTERNAL ROUTERS//
const blogRouter = require("./routers/blog-router");
const authRouter = require("./routers/auth-router");
const faqRouter = require("./routers/faq-router");
const reviewRouter = require("./routers/review-router");

// DATABASE DECLARATIONS SQLITE //
const connectSqlite3 = require("connect-sqlite3");
const SQLiteStore = connectSqlite3(expressSession);
database.runInitializing();

const app = express();
app.use(express.static("static"));

// Allows us to get the information from the forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  expressSession({
    store: new SQLiteStore({ db: "sessions.db" }),
    secret: "fijefopejgtgwam",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(function (request, response, next) {
  // Make the session available to all views.
  response.locals.session = request.session;
  next();
});

// EXTERNAL ROUTERS //
app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/faqs", faqRouter);
app.use("/reviews", reviewRouter);

app.engine(
  "hbs",
  expressHandlebars({
    defaultLayout: "main.hbs",
  })
);

app.get("/", function (request, response) {
  response.render("start.hbs");
});

app.get("/about", function (request, response) {
  response.render("about.hbs");
});

app.get("*", function (req, res) {
  res.status(404).send("Huh? Not found! Try Again!");
});

app.listen(8080);
