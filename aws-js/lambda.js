'use strict';

exports.handler = function(event, context, callback) {
  var intent = event.result.metadata['intentName'];
  var parameters = event.result.parameters;
  
    callback(null, {
      "speech": getResponse(intent, parameters)
    });
}

function getResponse(intent, parameters) {
  switch(intent) {
    case 'amountOfChapelCredits':
      return "Okay, you'll need " + data[intent][parameters['class']] + " credits for the semester.";
    case 'speakingInChapelThisWeek':
      return "It appears that Joe is speaking in chapel this week, although I can't know for sure yet.";
    case 'upcomingSGAEvents':
      return "I believe block party is tonight at 8:00 PM, but that's because you told me!";

    default:
      return "Sorry, I don't believe I understand the question.";
  }
}



var data = {
  "amountOfChapelCredits": {
    "Freshman": 36,
    "Sophomore": 36,
    "Junior": 26,
    "Senior": 26
  }
};