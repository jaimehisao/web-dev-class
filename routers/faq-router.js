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
  db.getAllFaqs(function (error, faq) {
    if (error) {
      const model = {
        error: ["Database error, please try again later!"],
        faq: [],
      };
      response.render("faq/faq.hbs", model);
    } else {
      const model = {
        faq,
      };
      //console.log(faq)
      response.render("faq/faq.hbs", model);
    }
  });
});

// ASK A QUESTION //
router.get("/ask", csrfProtection, function (request, response) {
  const model = {
    csrfToken: request.csrfToken(),
  };
  response.render("faq/ask_faq_question.hbs", model);
});

router.post("/ask", parseForm, csrfProtection, function (request, response) {
  const name = request.body.name;
  const question = request.body.question;
  const currentTime = helpers.getCurrentTime();
  const errors = helpers.validateFaq(name, question);

  if (errors.length === 0) {
    db.createFaqQuestion(name, question, currentTime, function (error, faqId) {
      if (error) {
        errors.push("Internal server error.");
        console.log(error);
        const model = {
          errors,
          name,
          question,
        };
        response.render("faq/ask_faq_question.hbs", model);
      } else {
        response.redirect("/faqs/");
      }
    });
  } else {
    const model = {
      errors,
      name,
      question,
    };
    response.render("faq/ask_faq_question.hbs", model);
  }
});

// RESPOND TO A QUESTION //
router.get("/:id/respond", csrfProtection, function (request, response) {
  const question = request.body.question;
  const id = request.params.id;
  const model = {
    question,
    id,
    csrfToken: request.csrfToken(),
  };
  response.render("faq/respond_faq_question.hbs", model);
});

router.post(
  "/:id/respond",
  parseForm,
  csrfProtection,
  function (request, response) {
    const questionResponse = request.body.questionResponse;
    const id = request.params.id;
    const responseTime = helpers.getCurrentTime();
    const errors = helpers.validateFaq("AAAAAAAAA", questionResponse);

    if (!request.session.isLoggedIn) {
      errors.push("Not logged in.");
    }

    const originalQuestion = db.getFaqsById(id, function (error) {
      errors.concat(error);
      if (errors.length === 0) {
        db.answerFAQ(id, questionResponse, responseTime, function (error) {
          if (error) {
            errors.push("Internal server error.");
            const model = {
              errors,
              id,
              originalQuestion,
            };
            response.render("faq/respond_faq_question.hbs", model);
          } else {
            response.redirect("/faqs");
          }
        });
      } else {
        const model = {
          errors,
          originalQuestion,
        };
        response.render("faq/ask_faq_question.hbs", model);
      }
    });
  }
);

router.get("/:id", function (request, response) {
  const id = request.params.id;
  db.getFaqsById(
    id,
    function (error, name, question, questionResponse, id, date) {
      let errors = [];
      if (error) {
        errors.push("Internal server error.");
        const model = {
          errors,
          name,
          question,
          questionResponse,
          id,
          date,
        };
        response.render("faq/faq.hbs", model);
      } else {
        const model = {
          name,
          question,
          questionResponse,
          id,
          date,
        };
        response.render("faq/faq.hbs", model);
      }
    }
  );
});

router.get("/:id/delete", csrfProtection, function (request, response) {
  const id = request.params.id;
  db.getFaqsById(id, function (error, faq) {
    let errors = [];
    if (error) {
      errors.push("Internal server error.");
      const model = {
        errors,
        faq,
      };
      response.render("faq/delete_faq.hbs", model);
    } else {
      const model = {
        faq,
        csrfToken: request.csrfToken(),
      };
      response.render("faq/delete_faq.hbs", model);
    }
  });
});

router.post(
  "/:id/delete",
  parseForm,
  csrfProtection,
  function (request, response) {
    const id = request.params.id;
    db.deleteFaq(id, function (error) {
      let errors = [];
      if (error) {
        errors.push("Internal server error.");
        const model = {
          errors,
          faq,
        };
        response.render("faq/delete_faq.hbs", model);
      } else {
        response.redirect("/faqs");
      }
    });

    db.getFaqsById(id, function (error, name, question, questionResponse, id) {
      const model = {
        name,
        question,
        questionResponse,
        id,
      };
      response.render("faq/delete_faq.hbs", model);
    });
  }
);

module.exports = router;
