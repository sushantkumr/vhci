$(document).ready(function() {
  var newCommand = true // Will be sent to server
  var oldResult = {} // Will be sent to server

  if (typeof webkitSpeechRecognition === 'function') {
    var streaming = new webkitSpeechRecognition()
  }

  var s = function () {
    if (typeof webkitSpeechRecognition !== 'function') {
      return
    }    
    streaming.lang = 'en-IN'
    streaming.continuous = true
    streaming.interimResults = false  

    streaming.onresult = function(event) {
      var transcription_textContent = ""
      for (var i = event.resultIndex; i < event.results.length; i++) {
          transcription_textContent += event.results[i][0].transcript
      }
      transcription_textContent = transcription_textContent.toLowerCase()
      console.log(transcription_textContent)
      $('input[name=command_text]').val(transcription_textContent)
      var length = transcription_textContent.length
      var pos_listen = transcription_textContent.search("listen")

      if (pos_listen != -1) {
        var command_exe = transcription_textContent.substring(pos_listen+7)
        console.log(command_exe)
        $('input[name=command_text]').val(command_exe)
        $("#main-submit").click()
      }
    }

    streaming.onend = function(event) {
      streaming.start()
    }   
  };

  // This will be executed when the page is loaded
  (function() {
    s()
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
    // streaming.stop()
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
          }
          if (typeof webkitSpeechRecognition === 'function') {
            streaming.stop()
            s()
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
