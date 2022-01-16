const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const helpers = require("../helpers");
const db = require("../database");

const router = express.Router();

// Setup for the CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });
router.use(cookieParser());

router.get("/", function (request, response) {
  db.getAllBlogPosts(function (error, blog) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        blogPost: [],
      };
      response.render("blog/blog.hbs", model);
    } else {
      const model = {
        hasDatabaseError: false,
        blog,
      };
      response.render("blog/blog.hbs", model);
    }
  });
});

router.get("/create", csrfProtection, function (request, response) {
  const model = {
    csrfToken: request.csrfToken(),
  };
  response.render("blog/create_blog_post.hbs", model);
});

router.post("/create", csrfProtection, parseForm, function (request, response) {
  const title = request.body.title;
  const textBody = request.body.textBody;
  const currentTime = helpers.getCurrentTime();
  const errors = [helpers.validateTitle(title), helpers.validateText(textBody)];

  if (!request.session.isLoggedIn) {
    errors.push("Not logged in.");
  }

  if (errors.length === 0) {
    db.createBlogPost(
      title,
      textBody,
      currentTime,
      function (error, blogPostId) {
        if (error) {
          errors.push("Internal server error.");
          const model = {
            errors,
            title,
            textBody,
          };
          response.render("blog/create_blog_post.hbs", model);
        } else {
          response.redirect("/blog");
        }
      }
    );
  } else {
    const model = {
      errors,
      title,
      textBody,
    };
    response.render("blog/create_blog_post.hbs", model);
  }
});

router.get("/:id", function (request, response) {
  const id = request.params.id;

  db.getBlogPostById(id, function (error, blogPost) {
    const model = {
      blogPost,
    };
    response.render("blog/blog.hbs", model);
  });
});

// UPDATE //
router.get("/:id/update", csrfProtection, function (request, response) {
  const id = request.params.id;

  db.getBlogPostById(id, function (error, blogPost) {
    const model = {
      id,
      blogPost,
      csrfToken: request.csrfToken(),
    };
    response.render("blog/update_blog_post.hbs", model);
  });
});

router.post(
  "/:id/update",
  csrfProtection,
  parseForm,
  function (request, response) {
    const id = request.params.id;
    const title = request.body.title;
    const textEntry = request.body.textEntry;
    const errors = [
      helpers.validateTitle(title),
      helpers.validateText(textEntry),
    ];

    // VERIFY IF USER IS LOGGED IN //
    if (!request.session.isLoggedIn) {
      errors.push("Not logged in.");
    }

    if (errors.length === 0) {
      db.updateBlogPostById(id, title, textEntry, function (error) {
        errors.push(error);
        response.redirect("/blog/");
      });
    } else {
      const model = {
        errors,
        product: {
          id,
          title,
          textEntry,
        },
      };
      response.render("blog/update_blog_post.hbs", model);
    }
  }
);

// DELETE //
router.get("/:id/delete", csrfProtection, function (request, response) {
  const id = request.params.id;
  db.getBlogPostById(id, function (error, blog) {
    let errors = [];
    if (error) {
      errors.push("Internal server error.");
      const model = {
        error,
        blog,
      };
      response.render("blog/delete_blog_post.hbs", model);
    } else {
      const model = {
        blog,
        id,
      };
      response.render("blog/delete_blog_post.hbs", model);
    }
  });
});

router.post(
  "/:id/delete",
  csrfProtection,
  parseForm,
  function (request, response) {
    const id = request.params.id; //ID of BlogPost to delete
    let errors = [];

    // VERIFY IF USER IS LOGGED IN //
    if (!request.session.isLoggedIn) {
      errors.push("Not logged in.");
    }

    if (errors.length === 0) {
      db.deleteBlogPostById(id, function (error) {
        response.redirect("/blog");
      });
    }
  }
);

module.exports = router;
