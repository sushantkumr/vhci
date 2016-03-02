$(document).ready(function() {
  
  // This will be executed when the page is loaded
  (function() {
    $('#result').parent().hide()
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
      var command = $('input[name=command_text]').val()
      // console.log(command)
      $.ajax({
        url: '/command',
        method: 'POST',
        data: {
          command: command
        },
        success: function(result) {
          var output_string = JSON.stringify(result, null, 2)
          $('#result').html(output_string).show().parent().show()
          console.log(output_string)
        },
        error: function() {}
      })
    }
    submit()
  })
})
