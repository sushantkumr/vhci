/* Speech and server controllers
 */
var recognizer

var setupRecognizer = function () {
  // Required class is defined only in Google chrome
  if (typeof webkitSpeechRecognition !== 'function') {
    return
  }
  recognizer = new webkitSpeechRecognition() // Create an instance of class
  recognizer.lang = 'en-IN' // Set language to English India
  recognizer.interimResults = false // We want results only after the user stops talking and not in-between

  // Function binding for onresult
  // Event.results is an array in which different parts of the sentence will be stored
  // It has only one element [0] as we have disabled interimResults
  // [0][0] because we have only one possible sentence. Will have [0][1], [0][2] etc if we get more than possibility eg star, start etc. We're not using that.
  // That is an object with the properties transcript and confidence
  // confidence has the probability that the transcript is exactly what the user spoke
  // transcript is what the user has spoken
  recognizer.onresult = function(event) {
    // Convert transcript to lower case and remove spaces from either end
    var inputContent = event.results[0][0].transcript.toLowerCase().trim()
    console.log('inputContent: ', inputContent)

    // Check if the command is to start a new session
    if (utils.isStartSession(inputContent)) {
      utils.clearSession()
      var panel = utils.generateDiv()
      var message = $('<pre>').html('Session started')
      panel.find('.box').append(message)
      $('.holder').prepend(panel)
      isSessionActive = true
      return
    }

    if (utils.isStopSession(inputContent)) {
      utils.clearSession()
      var panel = utils.generateDiv()
      var message = $('<pre>').html('Session stopped')
      panel.find('.box').append(message)
      $('.holder').prepend(panel)
      return
    }

    // If the message is not related to session (de)activation AND a session is active send input to server
    if (isSessionActive) {
      $('input[name=command_text]').val(inputContent)
      $('#command_form').submit()
    }
  }

  // We have to start the recognizer if it stops. Google won't let us run it continuously for a long time.
  recognizer.onend = function(event) {
    recognizer.start()
  }

  // Starting it for the first time
  recognizer.start()
}
