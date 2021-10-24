const MIN_LENGTH_BLOG_TITLE = 3
const MIN_TEXT_LENGTH_TEXT_BLOG = 5
const MAX_LENGTH_BLOG_TITLE = 50
const MAX_TEXT_LENGTH_TEXT_BLOG = 2000

exports.getValidationErrorsForProduct = function(title, text){

    const validationErrors = []

    if(!title){
        validationErrors.push("The title is missing.")
    }else if(title.length < MIN_LENGTH_BLOG_TITLE){
        validationErrors.push("The title needs to be at least "+MIN_LENGTH_BLOG_TITLE+" characters.")
    }else if(title.length > MAX_LENGTH_BLOG_TITLE){
        validationErrors.push('Title is too big, maximum length ' + MAX_LENGTH_BLOG_TITLE + ' characters')
    }

    if(!text){
        validationErrors.push("The text is missing.")
    }else if(text.length < MIN_TEXT_LENGTH_TEXT_BLOG){
        validationErrors.push("The text needs to be at least "+MIN_TEXT_LENGTH_TEXT_BLOG+" characters.")
    }else if(text.length > MAX_TEXT_LENGTH_TEXT_BLOG){
        validationErrors.push('Text is too big, maximum length ' + MAX_TEXT_LENGTH_TEXT_BLOG + ' characters')
    }

    return validationErrors

}