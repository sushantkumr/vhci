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
  recognizer.interimResults = false

  // Function binding for onresult
  recognizer.onresult = function(event) {
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

  recognizer.onend = function(event) {
    recognizer.start()
  }

  recognizer.start()
}
