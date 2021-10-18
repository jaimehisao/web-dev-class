const express = require('express')

const ADMIN_USERNAME = '1234'
const ADMIN_PASSWORD = '1234'

const router = express.Router()

router.get('/login', function(request, response){
    response.render('login.hbs')
})

router.post('/login', function(request, response){

    const username = request.body.username
    const password = request.body.password
    //console.log(request)

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        request.session.isLoggedIn = true

        //In the case that the user logs in.

        // TODO: Do something better than redirecting to start page.
        response.redirect('/')
    }else{
        // TODO: Display error message to the user.
        response.render('login.hbs')
    }

})

module.exports = router