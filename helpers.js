const MIN_LENGTH_BLOG_TITLE = 3
const MIN_TEXT_LENGTH_TEXT_BLOG = 5
const MAX_LENGTH_BLOG_TITLE = 50
const MAX_TEXT_LENGTH_TEXT_BLOG = 5000

exports.validateBlogPost = function(title, text){
    let errors = []
    const errors1 = validateTextIsntTooLong(text)
    if(errors1.length !== 0){
        errors.push(errors1[0])
    }
    const errors2 = validateTextIsntShort(text)
    if(errors2.length !== 0){
        errors.push(errors2[0])
    }
    const errors3 = validateTextIsntTooLong(title)
    if(errors3.length !== 0){
        errors.push(errors3[0])
    }
    const errors4 = validateTextIsntShort(title)
    if(errors4.length !== 0){
        errors.push(errors4[0])
    }
    return errors
}

exports.validateFaq = function(title, question){
    let errors = []
    const errors1 = validateTextIsntTooLong(question)
    if(errors1.length !== 0){
        errors.push(errors1[0])
    }
    const errors2 = validateTextIsntShort(question)
    if(errors2.length !== 0){
        errors.push(errors2[0])
    }
    const errors3 = validateTextIsntTooLong(title)
    if(errors3.length !== 0){
        errors.push(errors3[0])
    }
    const errors4 = validateTextIsntShort(title)
    if(errors4.length !== 0){
        errors.push(errors4[0])
    }
    return errors
}

exports.validateReview = function(title, question, name){
    let errors = []
    const errors1 = validateTextIsntTooLong(question)
    if(errors1.length !== 0){
        errors.push(errors1[0])
    }
    const errors2 = validateTextIsntShort(question)
    if(errors2.length !== 0){
        errors.push(errors2[0])
    }
    const errors3 = validateTextIsntTooLong(title)
    if(errors3.length !== 0){
        errors.push(errors3[0])
    }
    const errors4 = validateTextIsntShort(title)
    if(errors4.length !== 0){
        errors.push(errors4[0])
    }
    const errors5 = validateTextIsntTooLong(name)
    if(errors3.length !== 0){
        errors.push(errors5[0])
    }
    const errors6 = validateTextIsntShort(name)
    if(errors4.length !== 0){
        errors.push(errors6[0])
    }
    return errors
}

exports.getCurrentTime = function(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    return dateTime
}

validateTextIsntTooLong = function (text){
    const validationErrors = []
    if (!text){
        validationErrors.push("Text is missing.")

    }else if(text.length > MAX_TEXT_LENGTH_TEXT_BLOG){
        validationErrors.push("Text is too long, maximum 5000 characters.")
    }
    return validationErrors
}

validateTextIsntShort = function (text){
    const validationErrors = []
    if(!text){
        validationErrors.push("Text is missing.")
    }else if(text.length < MIN_TEXT_LENGTH_TEXT_BLOG){
        validationErrors.push("Text is too short, minimum 5 characters.")
    }
    return validationErrors
}
