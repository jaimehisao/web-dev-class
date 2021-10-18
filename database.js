/*
* File that handles all database operations regarding our Blog Posts, User accounts and FAQs.
*/
const sqlite = require('sqlite3')
const db = new sqlite.Database('hisao.db')

// INITIAL TABLE CREATION SECTION //
exports.runInitializing = function (){
    db.run(`
	CREATE TABLE IF NOT EXISTS blogPosts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		textEntry TEXT,
		date TEXT
	)
`)

    db.run(`
	CREATE TABLE IF NOT EXISTS faqs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		question TEXT,
		response TEXT,
		dateOfQuestion TEXT,
		dateOfResponse TEXT
	)
`)
}
// END OF TABLE CREATION SECTION //

// BLOG POSTS //
exports.getAllBlogPosts = function(callback){
    const query = "SELECT * FROM blogPosts"
    db.all(query, function(error, blogPosts){
        callback(error, blogPosts)
    })
}

exports.createBlogPost = function(title, textEntry, date, callback){

    const query = "INSERT INTO blogPosts (title, textEntry, date) VALUES (?, ?, ?)"
    const values = [title, textEntry, date]

    db.run(query, values, function(error){
        //console.log(error)
        callback(error, this.lastID)
    })

}

exports.getBlogPostById = function(id, callback){

    const query = "SELECT * FROM blogPosts WHERE id = ? LIMIT 1"
    const values = [id]

    db.get(query, values, function(error, blogPosts){
        callback(error, blogPosts)
    })

}

exports.deleteBlogPostById = function(id, callback){

    const query = "DELETE FROM blogPosts WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error)
    })

}

exports.updateBlogPostById = function(id, title, textEntry, callback){

    const query = "UPDATE blogPosts SET title = ?, textEntry = ? WHERE id = ?"
    const values = [title, textEntry, id]

    db.run(query, values, function(error){
        callback(error)
    })

}

// FAQs //

exports.getAllFaqs = function(callback){

    const query = "SELECT * FROM faqs"

    db.all(query, function(error, faqs){
        callback(error, faqs)
    })

}

exports.getFaqsById = function(id, callback){

    const query = "SELECT * FROM faqs WHERE id = ? LIMIT 1"
    const values = [id]

    db.get(query, values, function(error, faqs){
        callback(error, faqs)
    })

}

exports.createFaqQuestion = function(name, question, callback){

    const query = "INSERT INTO faqs (name, question) VALUES (?, ?)"
    const values = [name, question]

    db.run(query, values, function(error){
        callback(error, this.lastID)
    })

}


exports.answerFAQ = function(id, response, callback){

    const query = "UPDATE faqs SET response = ? WHERE id = ?"
    const values = [response, id]

    db.run(query, values, function(error){
        callback(error)
    })

}

exports.deleteFaq = function(id, callback){

    const query = "DELETE FROM faqs WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error)
    })

}