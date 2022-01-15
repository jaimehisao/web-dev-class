/*
 * File that handles all database operations regarding our Blog Posts, User accounts and FAQs.
 * By: Jaime Hisao Yesaki Hinojosa
 */
const sqlite = require("sqlite3");
const db = new sqlite.Database("hisao.db");

// INITIAL TABLE CREATION //
exports.runInitializing = function () {
  db.run(`
	    CREATE TABLE IF NOT EXISTS blogPosts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		textEntry TEXT,
		dateCreated INTEGER
	)
    `);

  db.run(`
	    CREATE TABLE IF NOT EXISTS faqs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		question TEXT,
		answer TEXT,
		dateOfQuestion INTEGER,
		dateOfResponse INTEGER
	)
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS reviews(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        review TEXT,
        dateCreated INTEGER,
        starRating INTEGER
        )
        `);
};

// BLOG POSTS //
exports.getAllBlogPosts = function (callback) {
  const query = "SELECT * FROM blogPosts";
  db.all(query, function (error, blogPosts) {
    callback(error, blogPosts);
  });
};

exports.createBlogPost = function (title, textEntry, date, callback) {
  const query =
    "INSERT INTO blogPosts (title, textEntry, dateCreated) VALUES (?, ?, ?)";
  const values = [title, textEntry, date];
  db.run(query, values, function (error) {
    callback(error, this.lastID);
  });
};

exports.getBlogPostById = function (id, callback) {
  const query = "SELECT * FROM blogPosts WHERE id = ? LIMIT 1";
  const values = [id];
  db.get(query, values, function (error, blogPosts) {
    callback(error, blogPosts);
  });
};

exports.deleteBlogPostById = function (id, callback) {
  const query = "DELETE FROM blogPosts WHERE id = ?";
  const values = [id];
  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.updateBlogPostById = function (id, title, textEntry, callback) {
  const query = "UPDATE blogPosts SET title = ?, textEntry = ? WHERE id = ?";
  const values = [title, textEntry, id];
  db.run(query, values, function (error) {
    callback(error);
  });
};

// FAQs //
exports.getAllFaqs = function (callback) {
  const query = "SELECT * FROM faqs";
  db.all(query, function (error, faqs) {
    callback(error, faqs);
  });
};

exports.getFaqsById = function (id, callback) {
  const query = "SELECT * FROM faqs WHERE id = ? LIMIT 1";
  const values = [id];
  db.get(query, values, function (error, faqs) {
    callback(error, faqs);
  });
};

exports.createFaqQuestion = function (name, question, date, callback) {
  const query =
    "INSERT INTO faqs (name, question, dateOfQuestion, dateOfResponse) VALUES (?, ?, ?, ?)";
  const values = [name, question, date, "Not answered yet"];
  db.run(query, values, function (error) {
    callback(error, this.lastID);
  });
};

exports.answerFAQ = function (id, response, responseTime, callback) {
  const query = "UPDATE faqs SET answer = ? , dateOfResponse = ? WHERE id = ?";
  const values = [response, responseTime, id];
  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deleteFaq = function (id, callback) {
  const query = "DELETE FROM faqs WHERE id = ?";
  const values = [id];
  db.run(query, values, function (error) {
    callback(error);
  });
};

// REVIEW SECTION //
exports.createReview = function (author, title, review, score, date, callback) {
  const query =
    "INSERT INTO reviews (title, author, review, starRating, dateCreated) VALUES (?, ?, ?, ?, ?)";
  const values = [title, author, review, score, date];
  db.run(query, values, function (error) {
    callback(error, this.lastID);
  });
};

exports.deleteReview = function (id, callback) {
  const query = "DELETE FROM reviews WHERE id = ?";
  const values = [id];
  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.updateReview = function (
  id,
  title,
  textEntry,
  author,
  score,
  callback
) {
  const query = "UPDATE reviews SET title = ?, textEntry = ? WHERE id = ?";
  const values = [title, textEntry, id];
  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.getReviewById = function (id, callback) {
  const query = "SELECT * FROM reviews WHERE id = ? LIMIT 1";
  const values = [id];
  db.get(query, values, function (error, reviews) {
    callback(error, reviews);
  });
};

exports.getAllReviews = function (callback) {
  const query = "SELECT * FROM reviews";
  db.all(query, function (error, reviews) {
    callback(error, reviews);
  });
};
