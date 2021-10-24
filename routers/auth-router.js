const express = require('express')
const bcrypt = require('bcrypt');

const ADMIN_USERNAME = '1234'
const ADMIN_PASSWORD = '$2a$10$uwmh5uFZArJXWb2/5./J2eNYDYWoe7Rx/phl0u7mEQQkmF0SEcB.m'

const router = express.Router()

router.get('/login', function(request, response){
    response.render('login.hbs')
})

router.post('/login', function(request, response){

    const username = request.body.username
    const password = request.body.password
    //console.log(request)
    if(username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD)){
        request.session.isLoggedIn = true

        //In the case that the user logs in.

        // TODO: Do something better than redirecting to start page.
        response.redirect('/')
    }else{
        // TODO: Display error message to the user.

        const model = {
            errors: ['Failed to log in! Try again with other credentials']
        }
        response.render('login.hbs', model)
    }

})

router.get('/logout', function(request, response){
    response.render('logout.hbs')
})

router.post('/logout', function(request, response){
    request.session.isLoggedIn = false
    response.redirect('/')
})

module.exports = router