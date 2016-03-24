$(document).ready(function() {
  
  // This will be executed when the page is loaded
  (function() {
    $('#confirm').parent().hide()
    $('#result').parent().hide()
    $('#output').parent().hide()
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
      if (command == 'yes'){
        url = '/execute'
      }
      else {
        url = '/command'
      }
      $.ajax({
        url: url,
        method: 'POST',
        data: {
          command: command
        },
        success: function(result) {
          //for interaction when said 'no'
            if(command == 'no'){
               $('#result').parent().hide()
               $('#confirm').parent().hide()
               var res = 'Enter the proper command'
              // var res = JSON.parse(res)
               $('#output').html(res).show().parent().show()  
          }

          //for interaction when said 'yes'
          else if (command == 'yes'){

                 $('#result').parent().hide()
                 $('#confirm').parent().hide()
                 var res = JSON.stringify(result, null, 2)
                 $('#output').html(res).show().parent().show()            
            }

          //  
          else{
                var confirm_string = result['confirm']
                var output_string = JSON.stringify(result['result'], null, 2)
                var message = JSON.parse(output_string)

                if(!message['message']) {
                  $('#output').parent().hide()
                  $('#confirm').html(confirm_string).show().parent().show()
                  $('#result').html(output_string).show().parent().show()
                }
                
                else {
                  $('#result').parent().hide()
                  $('#confirm').parent().hide()
                  $('#output').html(output_string).show().parent().show()
                }
          console.log(output_string)
          }
          
          
        },
        error: function() {}
      })
    }
    submit()
  })

})
