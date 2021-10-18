const express = require('express')
const validators = require('../validators')
const db = require('../database')

const router = express.Router()

router.get('/', function(request, response){
    db.getAllBlogPosts(function(error, blog){
        if(error){
            const model = {
                hasDatabaseError: true,
                blogPost: []
            }
            response.render('blog/blog.hbs', model)
        }else{
            const model = {
                hasDatabaseError: false,
                blog
            }
            response.render('blog/blog.hbs', model)
        }
    })
})

router.get('/create', function(request, response){
    response.render('blog/create_blog_post.hbs')
})

router.post('/create', function(request, response){

    const title = request.body.title
    const textBody = request.body.textBody
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    const errors = validators.getValidationErrorsForProduct(title, textBody)

    if(!request.session.isLoggedIn){
        errors.push("Not logged in.")
    }

    if(errors.length == 0){
        db.createBlogPost(title, textBody, dateTime, function(error, blogPostId){
            if(error){
                errors.push("Internal server error.")
                const model = {
                    errors,
                    title,
                    textBody
                }
                response.render('blog/create_blog_post.hbs', model)
            }else{
                response.redirect('/blog')
            }
        })
    }else{
        const model = {
            errors,
            title,
            textBody
        }
        response.render('blog/create_blog_post.hbs', model)
    }
})

// DELETE //
/*
router.get('/delete', function(request, response){
    response.render('blog/delete_blog_post.hbs')
})

router.post('/delete', function(request, response){

    const id = request.body.id
    let errors = []

    if(!request.session.isLoggedIn){
        errors.push("Not logged in.")
    }

    if(errors.length === 0){
        db.deleteFaq(id, function(error, blogPostId){
            if(error){
                errors.push("Internal server error.")
                const model = {
                    errors,
                    id
                }
                response.render('blog/create_blog_post.hbs', model)
            }else{
                response.redirect('/blog/')
            }
        })
    }else{
        const model = {
            errors,
            id
        }
        response.render('blog/create_blog_post.hbs', model)
    }
})
*/


//
router.get('/:id', function(request, response){

    const id = request.params.id

    db.getBlogPostById(id, function(error, blogPost){
        // TODO: Handle error.
        const model = {
            blogPost
        }
        response.render('blog/blog.hbs', model)
    })

})

router.get('/:id/update', function(request, response){

    const id = request.params.id

    db.getBlogPostById(id, function(error, blogPost){
        // TODO: Handle error.
        const model = {
            id,
            blogPost
        }
        response.render('blog/update_blog_post.hbs', model)
    })
})

router.post('/:id/update', function(request, response){

    const id = request.params.id
    const title = request.body.title
    const textEntry = request.body.textEntry

    // ERRORS //
    const errors = []
    //const errors = validators.getValidationErrorsForProduct(title, textEntry)


    // VERIFY IF USER IS LOGGED IN //
    if(!request.session.isLoggedIn){
        errors.push("Not logged in.")
    }

    if(errors.length === 0){

        db.updateBlogPostById(id, title, textEntry, function(error){
            //console.log(error)
            //console.log('ERROR WHEN UDPATING BLOG')
            // TODO: Handle error.

            response.redirect('/blog/')

        })

    }else{
        const model = {
            errors,
            product: {
                id,
                title,
                textEntry
            }
        }

        response.render('blog/update_blog_post.hbs', model)

    }

})


router.get('/:id/delete', function(request, response){
    const id = request.params.id
    db.getBlogPostById(id, function(error, blog){
        let errors = []
        if(error){
            errors.push("Internal server error.")
            const model = {
                error,
                blog
            }
            response.render('blog/delete_blog_post.hbs', model)
        }else{
            const model = {
                blog,
                id
            }
            response.render('blog/delete_blog_post.hbs', model)
        }
    })
})

router.post('/:id/delete', function(request, response){
    const id = request.params.id
    // TODO: Check if the user is logged in, and only carry
    // out the request if the user is.
    db.deleteBlogPostById(id, function(error){
        // TODO: Handle error.
        response.redirect('/blog')
    })

})



module.exports = router