const MIN_TEXT_LENGTH = 4;
const MAX_TEXT_LENGTH_TITLE = 50;
const MAX_TEXT_LENGTH = 5000;

// Function to validate that title is not empty, too short or too long.
exports.validateTitle = function (text) {
  if (!text) {
    return "Title is missing.";
  } else if (text.length < MIN_TEXT_LENGTH) {
    return "Title is too short, minimum 4 characters.";
  } else if (text.length > MAX_TEXT_LENGTH_TITLE) {
    return "Title is too long, maximum 50 characters.";
  }
};

// Function to validate that text is not empty, too short or too long.
exports.validateText = function (text) {
  if (!text) {
    return "Text entry is missing.";
  } else if (text.length < MIN_TEXT_LENGTH) {
    return "Text entry is too short, minimum 4 characters.";
  } else if (text.length > MAX_TEXT_LENGTH) {
    return "Text entry is too long, maximum 5000 characters.";
  }
};

// Function to facilitate the retrieval of current time
exports.getCurrentTime = function () {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + " " + time;
  return dateTime;
};
