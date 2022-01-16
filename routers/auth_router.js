const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

// CONSTANTS //
const ADMIN_USERNAME = "1234";
const ADMIN_PASSWORD =
  "$2a$10$uwmh5uFZArJXWb2/5./J2eNYDYWoe7Rx/phl0u7mEQQkmF0SEcB.m";

const router = express.Router();

// Setup for the CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });
router.use(cookieParser());

// LOGIN //
router.get("/login", csrfProtection, function (request, response) {
  const model = {
    csrfToken: request.csrfToken(),
  };
  response.render("login.hbs", model);
});

router.post("/login", csrfProtection, parseForm, function (request, response) {
  const username = request.body.username;
  const password = request.body.password;
  if (
    username === ADMIN_USERNAME &&
    bcrypt.compareSync(password, ADMIN_PASSWORD)
  ) {
    request.session.isLoggedIn = true;
    //In the case that the user logs in.
    response.redirect("/");
  } else {
    const model = {
      errors: ["Failed to log in! Try again with other credentials"],
    };
    response.render("login.hbs", model);
  }
});

// LOGOUT //
router.get("/logout", csrfProtection, function (request, response) {
  const model = {
    csrfToken: request.csrfToken(),
  };
  response.render("logout.hbs", model);
});

router.post("/logout", csrfProtection, parseForm, function (request, response) {
  request.session.isLoggedIn = false;
  response.redirect("/");
});

module.exports = router;
