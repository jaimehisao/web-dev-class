// NPM IMPORTS //
const express = require("express");
const database = require("./database");
// EXPRESS PACKAGES //
const expressHandlebars = require("express-handlebars");
const expressSession = require("express-session");

// DECLARATION OF EXTERNAL ROUTERS//
const blogRouter = require("./routers/blog_router");
const authRouter = require("./routers/auth_router");
const faqRouter = require("./routers/faq_router");
const reviewRouter = require("./routers/review_router");

// DATABASE DECLARATIONS SQLITE //
const connectSqlite3 = require("connect-sqlite3");
const SQLiteStore = connectSqlite3(expressSession);
database.runInitializing();

// App declaration
const app = express();
app.use(express.static("static"));

// Allows us to get the information from the forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

// Sessions Store
app.use(
  expressSession({
    store: new SQLiteStore({ db: "sessions.db" }),
    secret: "fijefopejgtgwam",
    resave: false,
    saveUninitialized: false,
  })
);

// Make the session available to all views.
app.use(function (request, response, next) {
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

// Start Page
app.get("/", function (request, response) {
  response.render("start.hbs");
});

// About Page
app.get("/about", function (request, response) {
  response.render("about.hbs");
});

// Default Route for Not Found Resources
app.get("*", function (request, response) {
  response.render("errors/page_not_found.hbs");
});

app.listen(8080);
