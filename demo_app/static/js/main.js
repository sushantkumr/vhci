$(document).ready(function() {
  
  // This will be executed when the page is loaded
  (function() {
    $('#confirm').parent().hide()
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
          var confirm_string = result['confirm']
          var output_string = JSON.stringify(result['result'], null, 2)
          var out = JSON.parse(output_string)
          if(!out['message']) {
          $('#output').parent().hide()
          $('#confirm').html(confirm_string).show().parent().show()
          $('#result').html(output_string).show().parent().show()}
          else{
            $('#confirm').parent().hide()
            $('#result').parent().hide()
            $('#output').html(output_string).show().parent().show()
          }
          console.log(output_string)
        },
        error: function() {}
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
