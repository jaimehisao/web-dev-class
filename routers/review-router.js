const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const db = require("../database");
const helpers = require("../helpers");
const router = express.Router();

// Setup for the CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });
router.use(cookieParser());

router.get("/", function (request, response) {
  db.getAllReviews(function (error, reviews) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        reviews: [],
      };
      response.render("review/review.hbs", model);
    } else {
      const model = {
        hasDatabaseError: false,
        reviews,
      };
      response.render("review/review.hbs", model);
    }
  });
});

// POST A REVIEW //
router.get("/create", csrfProtection, function (request, response) {
  const model = {
    csrfToken: request.csrfToken(),
  };
  response.render("review/create_review.hbs", model);
});

router.post("/create", parseForm, csrfProtection, function (request, response) {
  const author = request.body.postedBy;
  const title = request.body.title;
  const textBody = request.body.review;
  const score = request.body.score;
  const dateTime = helpers.getCurrentTime();
  const errors = helpers.validateReview(title, textBody);

  if (errors.length === 0) {
    db.createReview(
      author,
      title,
      textBody,
      score,
      dateTime,
      function (error, review) {
        if (error) {
          errors.push("Internal server error.");
          errors.push(error);
          const model = {
            errors,
            author,
            title,
            textBody,
            score,
          };
          response.render("review/create_review.hbs", model);
        } else {
          response.redirect("/reviews/");
        }
      }
    );
  } else {
    const model = {
      errors,
      author,
      title,
      textBody,
      score,
    };
    response.render("review/create_review.hbs", model);
  }
});

router.get("/:id", function (request, response) {
  const id = request.params.id;
  db.getReviewById(id, function (error, review) {
    let errors = [];
    if (error) {
      errors.push("Internal server error.");
      const model = {
        errors,
        review,
      };
      response.render("review/review.hbs", model);
    } else {
      const model = {
        errors,
        review,
        id,
      };
      response.render("review/review.hbs", model);
    }
  });
});

router.get("/:id/delete", csrfProtection, function (request, response) {
  const id = request.params.id;
  db.getReviewById(id, function (error, review) {
    let errors = [];
    if (error) {
      errors.push("Internal server error.");
      console.log(errors);
      const model = {
        errors,
        review,
      };
      response.render("review/delete_review.hbs", model);
    } else {
      const model = {
        review,
        csrfToken: request.csrfToken(),
      };
      response.render("review/delete_review.hbs", model);
    }
  });
});

router.post(
  "/:id/delete",
  parseForm,
  csrfProtection,
  function (request, response) {
    const id = request.params.id;
    let errors = [];

    // VERIFY IF USER IS LOGGED IN //
    if (!request.session.isLoggedIn) {
      errors.push("Not logged in.");
    }

    if (errors.length === 0) {
      db.deleteReview(id, function (error) {
        if (error) {
          errors.push("Internal server error.");
          const model = {
            errors,
          };
          response.render("review/delete_review.hbs", model);
        } else {
          response.redirect("/reviews");
        }
      });
    }
  }
);

module.exports = router;
