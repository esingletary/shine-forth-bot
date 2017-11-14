// Check to see if the cookie is set and if it is, check its value.
function checkTTSCookie() {
  if (Cookies.get('isTTSEnabled') !== 'undefined') {
    if (Cookies.get('isTTSEnabled') === 'false') {
      return false;
    } else {
      return true;
    }
  }
  return true;
}

// Speak text out loud using the browser's SpeechSynthesis API.
function speakOutLoud(text) {
  var msg = new SpeechSynthesisUtterance();
  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  msg.text = text;
  msg.lang = 'en-US';
  speechSynthesis.speak(msg);
}

// Scroll the div to the bottom.
function scrollDivToTop() {
  var div = $('.chat-body');
  var height = div[0].scrollHeight;
  div.scrollTop(height);
}

// Make the bot say text.
function botSay(textToSay) {
  var botInput = $('<p></p>');
  botInput.text(textToSay);
  botInput.addClass("bot-text");
  $('.chat-body').append(botInput);
  scrollDivToTop();
  if (checkTTSCookie()) {
    speakOutLoud(textToSay);
  }
}

// Process the user input via api.ai and get output for the bot to say
function processNaturalLanguage(speechInput) {
  var accessToken = "72b5673eeab9485fa58008d6bef60a61",
    baseUrl = "https://api.api.ai/v1/query?v=20170510/";
  console.log(speechInput);
  $.ajax({
    type: "POST",
    url: baseUrl + "query/",
    contentType: "application/json; charset=utf-8",
    dataTyle: "json",
    headers: {
      "Authorization": "Bearer " + accessToken
    },
    data: JSON.stringify({
      query: speechInput,
      lang: "en",
      sessionId: "shineforth-xyz"
    }),
    success: function(data) {
      console.log(data)
      botSay(data.result.fulfillment.speech);
    },
    error: function(data) {
      console.log(data);
      botSay("Sorry! It seems I'm having issues connecting. Try again later.");
    }
  });
}

// Make the user say text.
function userSay(textToSay) {
  if (!validateText(textToSay)) {
    return;
  }
  var userInput = $('<p></p>');
  userInput.text(textToSay);
  userInput.addClass("user-text");
  $('.chat-body').append(userInput);
  $('.user-input').val("");
  processNaturalLanguage(textToSay);
  scrollDivToTop();
}

// Check if the text is valid before allowing it to be sent.
function validateText(text) {
  if (text === "") {
    return false;
  } else if ($.trim(text) == '') {
    return false;
  } else {
    return true;
  }
}

// Check if the cookie exist, and if not, set it.
if (Cookies.get('isTTSEnabled') === 'undefined') {
    Cookies.set('isTTSEnabled', true, { expires: 7 });
    }

// Click listener for the submit button
$('.submit-button').click(function() {
  userSay($('.user-input').val());
});

// Keypress listener for the enter key
$('.user-input').keypress(function(e) {
  if (e.which == 13) {
    userSay($('.user-input').val());
  }
});

// Fade in the div
$(function(){  // $(document).ready shorthand
  $('.fader').hide().fadeIn('slow');
});

// Add a spin effect to the options cog
$('.upper-right-cog').hover(function() {
  $('.upper-right-cog').addClass('fa-spin');
}, function() {
  $('.upper-right-cog').removeClass('fa-spin');
});

// Check the box in the options modal if the cookie is set
$('.upper-right-cog').click(function() {
   if (Cookies.get('isTTSEnabled') === 'false') {
    $('.enable-tts').prop('checked', false);
   } else {
     $('.enable-tts').prop('checked', true);
   }
  $("#optionsModal").modal();
});

// Save the cookie setting if save changes is clicked
$('.save-tts-setting').click(function() {
  if ($('.enable-tts').prop("checked")) {
    Cookies.set('isTTSEnabled', true, { expires: 7 });
  } else {
    Cookies.set('isTTSEnabled', false, { expires: 7 });
  }
})

// Say the initial message
botSay("Hello! Welcome to Shine Forth Bot. For this demo, ask me about chapel credits :)");

// WebSpeech Stuff
window.SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  null;

if (window.SpeechRecognition === null) {
  console.log("No Webkit speech recognition!")
} else {
  $('.speech-button').removeClass('fa-microphone-slash');
  $('.speech-button').addClass('fa-microphone');
  var recognizer = new window.SpeechRecognition();

  recognizer.onresult = function(e) {
    $('.speech-input').val("");

    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        $('.user-input').val(event.results[i][0].transcript);
        $('.speech-button').removeClass("red-mic");
      } else {
        $('.user-input').val(function(i, val) {
          return event.results[i][0].transcript;
        });
      }
    }
    recognizer.onerror = function(event) {
      console.log('Recognition error');
      $('.speech-button').removeClass("red-mic");
    };
  }

  $('.speech-button').click(function() {
    recognizer.start();
    $('.speech-button').addClass("red-mic");
    $('.user-input').val("");
  });
}