$(document).ready(function() {
    // var recorder = [undefined];
    var streaming = new webkitSpeechRecognition();
    streaming.start();
    var s = function () {
      // recorder[0] = streaming;
      streaming.lang = 'en-IN';
      streaming.continuous = true;
      streaming.interimResults = false;    

      streaming.onresult = function(event) {
        var transcription_textContent = "";
        for (var i = event.resultIndex; i < event.results.length; i++) {
            transcription_textContent += event.results[i][0].transcript;
          }
        transcription_textContent = transcription_textContent.toLowerCase();
        console.log(transcription_textContent);
        $('input[name=command_text]').val(transcription_textContent);
        var length = transcription_textContent.length;
        var pos_listen = transcription_textContent.search("listen");

        if (pos_listen != -1) {
          var command_exe = transcription_textContent.substring(pos_listen+7);
          console.log(command_exe);
          $('input[name=command_text]').val(command_exe);
          $("#main-submit").click();
        }
      }

      streaming.onend = function(event) {
        streaming.start();
      }   
    }

    s();
  // This will be executed when the page is loaded
  (function() {
    $('#result').parent().hide();
    // s();
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
    // recorder[0].stop()
    // streaming.stop();
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
          // console.log(output_string)
          streaming.stop();
          s();
        },
        error: function() {}
      })
    }
    submit()
  })

  // $('#ss').on('click', function(event){
  //   console.log(1)
  //   $('input[name=command_text]').val("play song1.mp3");
  //   $("#main-submit").click();
  // })
})
