const express = require('express')
const db = require('../database')
const router = express.Router()

router.get('/', function(request, response){

    db.getAllReviews(function (error, reviews){
        if (error){
            const model = {
                hasDatabaseError: true,
                reviews: []
            }
            response.render('review/review.hbs', model)
        }else{
            const model = {
                hasDatabaseError: false,
                reviews
            }
            response.render('review/review.hbs', model)
        }
    })
})

// ASK A QUESTION //
router.get('/create', function(request, response){
    response.render('review/create_review.hbs')
})

router.post('/create', function(request, response){

    const author = request.body.postedBy
    const title = request.body.title
    const textBody = request.body.review
    const score = request.body.score

    // TODO VALIDATION OF INPUTED TEXT
    //const errors = validators.getValidationErrorsForProduct(title, textBody)
    let errors = []

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;


    if(errors.length === 0){
        db.createReview(author, title, textBody, score, dateTime, function(error, review){
            if(error){
                errors.push("Internal server error.")
                console.log(error)
                const model = {
                    errors,
                    author,
                    title,
                    textBody,
                    score
                }
                response.render('review/create_review.hbs', model)
            }else{
                response.redirect('/reviews/')
            }
        })
    }else{
        const model = {
            errors,
            author,
            title,
            textBody,
            score
        }
        response.render('review/create_review.hbs', model)
    }
})

router.get('/:id', function(request, response){
    const id = request.params.id
    db.getReviewById(id, function(error, review) {
        let errors = []
        //TODO ADD MISSING ERRORS
        if(error){
            errors.push("Internal server error.")
            const model = {
                errors,
                review
            }
            response.render('review/review.hbs', model)
        }else{
            const model = {
                errors,
                review,
                id
            }
            response.render('review/review.hbs', model)
        }
    })
})


router.get('/:id/delete', function(request, response){
    const id = request.params.id
    db.getReviewById(id, function(error, review){

        let errors = []
        if(error){
            errors.push("Internal server error.")
            console.log(errors)
            const model = {
                errors,
                review
            }
            response.render('review/delete_review.hbs', model)
        }else{
            const model = {
                review
            }
            response.render('review/delete_review.hbs', model)
        }
    })
})

router.post('/:id/delete', function(request, response){
    const id = request.params.id
    db.deleteReview(id, function(error){
        let errors = []
        if(error) {
            errors.push("Internal server error.")
            const model = {
                errors
            }
            response.render('review/delete_review.hbs', model)
        }else {
            response.redirect('/reviews')
        }
    })
})



module.exports = router