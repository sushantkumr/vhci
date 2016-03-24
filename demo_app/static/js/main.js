$(document).ready(function() {
  
  // This will be executed when the page is loaded
  (function() {
    $('#result').parent().hide()
    $('#confirm').parent().hide()
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
          if(!out['message']){
            $('#output').parent().hide()
            $('#confirm').html(confirm_string).show().parent().show()
            $('#result').html(output_string).show().parent().show()
            //$('#inp').html(confirm_string).show().parent().show()

          }else{
            //$('#confirm').html("").show().parent().show()
            $('#result').parent().hide()
            $('#confirm').parent().hide()
            $('#output').html(output_string).show().parent().show()
          }
          
         
          console.log(output_string)
        },
        error: function() {}
      })
    }
    submit()
  })

  // For confirmation
  $('#yes').click(function(e){
    e.preventDefault()
   var command = $('input[name=command_text]').val()
   alert(command)
    var doit = function(){
     
          $.ajax({
            url: '/execute',
            method: 'POST',
            data: {
              command: command
            },
            success: function(result) {
               $('#result').parent().hide()
               $('#confirm').parent().hide()

               var res = JSON.stringify(result, null, 2)
               $('#output').html(res).show().parent().show()
            },
            error: function() {}
          })
    }
    doit()

  })
  })

