/* Speech and server controllers
 */
var recognizer

var setupRecognizer = function () {
  if (typeof webkitSpeechRecognition !== 'function') {
     return
  }
  recognizer = new webkitSpeechRecognition()
  recognizer.lang = 'en-IN'
  recognizer.continuous = true
  recognizer.interimResults = false

  recognizer.onresult = function(event) {
    var inputContent = ''
    for (var i = event.resultIndex; i < event.results.length; i++) {
         inputContent += event.results[i][0].transcript
    }
    inputContent = inputContent.toLowerCase()
    console.log('inputContent: ', inputContent)
    inputContent = inputContent.trim()

    // Check if the command is to start a new session
    if (utils.isStartSession(inputContent)) {
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
      $('#main-submit').click()
    }
  }

  recognizer.onend = function(event) {
    recognizer.start()
  }

  recognizer.start()
}
