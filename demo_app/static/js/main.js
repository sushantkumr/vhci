$(document).ready(function() {

  var newCommand = true // Will be sent to server
  var oldResult = {}; // Will be sent to server
  /* PS: If you remove the semi-colon on the previous line it'll cause an error
   * which you can see in the console. This is one of the cases where a semi-colon is required!
   */

  // This will be executed when the page is loaded
  (function() {
    $('#result').hide().parent().hide()
  })()

  // Handles voice input
  $('#main-speech').click(function() {
    var record = function() {
      if(typeof webkitSpeechRecognition !== 'function') {
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
        },
        error: function(a, b, c) {
          console.log(a, b, c)
          $('#message').html('Something went wrong. Please try again.').show().parent().show()
        }
      })
    }
    submit()
  })

  $('#confirm-submit').click(function(e) {
    e.preventDefault()
    var submit = function() {
      alert('qwe')
      var command = $('input[name=command_text]').val()
      // console.log(command)
      $.ajax({
        url: '/execute',
        method: 'POST',
        data: {
          command: command
        },
        success: function(result) {
        $('#confirm').parent().hide()
        $('#result').parent().hide()
        var res = JSON.stringify(result,null,2)
        $('#output').html(res).show().parent().show()
        },
        error: function() {}
      })
    }
    submit()
  })
})
