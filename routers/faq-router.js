const express = require('express')
const db = require('../database')
const router = express.Router()

router.get('/', function(request, response){
        db.getAllFaqs(function(error, faq){
            if(error){
                const model = {
                    hasDatabaseError: true,
                    faq: []
                }
                response.render('faq/faq.hbs', model)
            }else{
                const model = {
                    hasDatabaseError: false,
                    faq
                }
                //console.log(faq)
                response.render('faq/faq.hbs', model)
            }
        })
})

// ASK A QUESTION //
router.get('/ask', function(request, response){
    response.render('faq/ask_faq_question.hbs')
})

router.post('/ask', function(request, response){

    const name = request.body.name
    const question = request.body.question

    // TODO VALIDATION OF INPUTED TEXT
    //const errors = validators.getValidationErrorsForProduct(title, textBody)
    let errors = []
    if(!request.session.isLoggedIn){
        errors.push("Not logged in.")
    }

    if(errors.length === 0){
        db.createFaqQuestion(name, question, function(error, faqId){
            if(error){
                errors.push("Internal server error.")
                console.log(error)
                const model = {
                    errors,
                    name,
                    question
                }
                response.render('faq/ask_faq_question.hbs', model)
            }else{
                response.redirect('/faqs/')
            }
        })
    }else{
        const model = {
            errors,
            name,
            question
        }
        response.render('faq/ask_faq_question.hbs', model)
    }
})

// RESPOND TO A QUESTION //
router.get('/:id/respond', function(request, response){
    const question = request.body.question
    const id = request.params.id
    const model = {
        question,
        id
    }
    response.render('faq/respond_faq_question.hbs', model)
})

router.post('/:id/respond', function(request, response){

    // TODO VALIDATIONS WHEN SUBMITTING A QUESTION
    const questionResponse = request.body.questionResponse
    const id = request.header.id
    // TODO VALIDATION OF INPUTED TEXT
    //const errors = validators.getValidationErrorsForProduct(title, textBody)

    let errors = []

    if(!request.session.isLoggedIn){
        errors.push("Not logged in.")
    }

    const originalQuestion = db.getBlogPostById(id, function (error){
        errors.concat(error)
        if(errors.length === 0){
            db.answerFAQ(id, questionResponse, function(error){
                if(error){
                    errors.push("Internal server error.")
                    //console.log(error)
                    const model = {
                        errors,
                        id,
                        originalQuestion
                    }
                    response.render('faq/respond_faq_question.hbs', model)
                }else{
                    response.redirect('/faqs')
                }
            })
        }else{
            const model = {
                errors,
                originalQuestion
            }
            response.render('faq/ask_faq_question.hbs', model)
        }
    })


})

/*
router.post('/ask', function(request, response){

    // TODO VALIDATIONS WHEN SUBMITTING A QUESTION
    const name = request.body.name
    const question = request.body.question

    // TODO VALIDATION OF INPUTED TEXT
    //const errors = validators.getValidationErrorsForProduct(title, textBody)
    let errors = []
    if(!request.session.isLoggedIn){
        errors.push("Not logged in.")
    }

    if(errors.length === 0){
        db.createFaqQuestion(name, question, function(error, faqId){
            if(error){
                errors.push("Internal server error.")
                console.log(error)
                const model = {
                    errors,
                    name,
                    question
                }
                response.render('faq/ask_faq_question.hbs', model)
            }else{
                response.redirect('/faqs/')
            }
        })
    }else{
        const model = {
            errors,
            name,
            question
        }
        response.render('faq/ask_faq_question.hbs', model)
    }
})
*/

router.get('/:id', function(request, response){

    const id = request.params.id

    db.getFaqsById(id, function(error, name, question, questionResponse, id) {
        let errors = []
        //TODO ADD MISSING ERRORS
        if(error){
            errors.push("Internal server error.")
            const model = {
                errors,
                name,
                question,
                questionResponse,
                id
            }
            response.render('faq/faq.hbs', model)
        }else{
            const model = {
                name,
                question,
                questionResponse,
                id
            }
            response.render('faq/faq.hbs', model)
        }
    })
})

router.get('/:id/delete', function(request, response){

    const id = request.params.id

    db.getFaqsById(id, function(error, faq){

        let errors = []
        if(error){
            errors.push("Internal server error.")
            const model = {
                errors,
                faq
                }
            response.render('faq/delete_faq.hbs', model)
        }else{
            const model = {
                faq
            }
            response.render('faq/delete_faq.hbs', model)
            }
    })

})

router.post('/:id/delete', function(request, response){

    const id = request.params.id
    db.deleteFaq(id, function(error){

        // TODO: Handle error.

        response.redirect('/faqs')

    })

    db.getFaqsById(id, function(error, name, question, questionResponse, id) {
        // TODO: Handle error.
        //console.log(error)
        const model = {
            name,
            question,
            questionResponse,
            id
        }
        response.render('faq/delete_faq.hbs', model)
    })
})



module.exports = router