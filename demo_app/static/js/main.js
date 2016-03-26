$(document).ready(function() {
  var CLOCK_INTERVAL = 1000 // Clock will be called every second (1000 ms)
  var SESSION_DURATION = 20 // Active for this long without any activity

  var newCommand = true // Will be sent to server
  var oldResult = {} // Will be sent to server

  var sessionDuration = 0 // Time left before the session expires

  var clock = function() {
    if (sessionDuration > 0) {
      sessionDuration -= 1
      if (sessionDuration === 0) {
        console.log('Session ended')
      }
    }
    else {
      sessionDuration = 0
    }
  }

  var interval = setInterval(clock, CLOCK_INTERVAL)

  if (typeof webkitSpeechRecognition === 'function') {
    var streamer = new webkitSpeechRecognition()
  }

  var setupStreamer = function () {
    if (typeof webkitSpeechRecognition !== 'function') {
      return
    }
    streamer.lang = 'en-IN'
    streamer.continuous = true
    streamer.interimResults = false

    streamer.onresult = function(event) {
      var inputContent = ''
      for (var i = event.resultIndex; i < event.results.length; i++) {
          inputContent += event.results[i][0].transcript
      }
      inputContent = inputContent.toLowerCase()
      console.log('inputContent: ', inputContent)

      // Check if the command is to start a new session
      // Display a message saying that the system can now receive commands
      var isStartSession = inputContent.search('start session')
      if (isStartSession !== -1) {
        // Saying start session even when a session is active will set it to SESSION_DURATION
        sessionDuration = SESSION_DURATION
        console.log('Session started')
        return
      }

      var isStopSession = inputContent.search('stop session')
      if (isStopSession !== -1) {
        sessionDuration = 0
        console.log('Session stopped')
        return
      }

      // If the message is not related to session (de)activation AND a session is active send input to server
      if (sessionDuration > 0) {
        $('input[name=command_text]').val(inputContent)
        $('#main-submit').click()
      }
    }

    streamer.onend = function(event) {
      streamer.start()
    }
  };

  // This will be executed when the page is loaded
  (function() {
    setupStreamer()
    streamer.start()
    $('#result').hide().parent().hide()
  })()

  // Handles voice input
  $('#main-speech').click(function() {
    var record = function() {
      if (typeof webkitSpeechRecognition !== 'function') {
        alert('Please use Google Chrome for voice input')
        return
      }
      var recording = new webkitSpeechRecognition()
      recording.lang = 'en-IN'
      recording.onresult = function(event) {
        $('input[name=command_text]').val(event.results[0][0].transcript)
        // console.log(event.results[0][0])
        // Optional
        // $('#command_form').submit()
      }
      recording.start()
    }
    record()
  })

  // Submits form using AJAX
  $('#main-submit').click(function(e) {
    e.preventDefault()
    // recorder[0].stop()
    // streamer.stop()
    var submit = function() {
      var data = {}
      data.input = $('input[name=command_text]').val()
      data.newCommand = newCommand // Global variable
      data.oldResult = JSON.stringify(oldResult)
      // console.log(command)
      $.ajax({
        url: '/command',
        method: 'POST',
        data: data,
        success: function(result) {
          // Clear existing content
          $('#message').html('')
          $('#options').html('')
          $('#result').html('')

          console.log(result)
          if (result.error === true) {
            // Handle error
            oldResult = {}
            newCommand = true
            return
          }
          if (result.final === true) { // Current command has been executed completely, start new session
            oldResult = {}
            newCommand = true
            var parsed = JSON.stringify(result.parsed, null, 2)
            $('#result').html(parsed).show().parent().show()
            $('#message').html(result.message)
          }
          else if (result.final === false) { // Needs confirmation or more information
            var parsed = JSON.stringify(result.parsed, null, 2)
            oldResult = result
            newCommand = false
            $('#result').html(parsed).show().parent().show()
            $('#message').html(result.message)
            if (result.options !== undefined) {
              var options = $('<ol>')
              result.options.forEach(function(option) {
                options.append($('<li>').html(option))
              })
              $('#options').html(options)
            }
          }
          if (typeof webkitSpeechRecognition === 'function') {
            streamer.stop()
          }
        },
        error: function(a, b, c) {
          console.log(a, b, c)
          $('#message').html('Something went wrong. Please try again.').show().parent().show()
        }
      })
    }
    submit()
  })
})
