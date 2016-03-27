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
    streaming.start()
  };

  // This will be executed when the page is loaded
  (function() {
    s()
    $('#result').hide().parent().hide()
    $('#tweet').hide().parent().hide()
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
          // Clear existing content
          $('#message').html('')
          $('#options').html('')
          $('#result').html('')
          $('#tweet').html('')

          console.log(result)
          if (result.error === true) {
            // Handle error
            oldResult = {}
            newCommand = true
           // delete when everything is fine 
             // $('#result').hide().parent().hide()
            $('#tweet').hide().parent().hide()
            return
          }
         
          if (result.final === true) { // Current command has been executed completely, start new session
            oldResult = {}
            newCommand = true
            var parsed = JSON.stringify(result.parsed, null, 2)
            $('#result').html(parsed).show().parent().show()
            $('#message').html(result.message).show().parent().show()
          }
          // the below code is only for twitter delete after the interaction is made proper
          if (result.final === 'twitter_False'){
             var parsed = JSON.stringify(result.parsed, null, 2)
            oldResult = {}
            newCommand = true
            $('#result').html(parsed).show().parent().show()
            $('#message').html(result.message)
            if (result.options !== undefined) {
              var options = $('<ol>')
              result.options.forEach(function(option) {
                options.append($('<li>').html(option))
              })
              $('#options').html(options)
              $('#tweet').hide()
            }
          } 
          // ...............................................................................

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

          // tweets are otputed here.....................................
          if (result.tweet){
            var leng=-1
            var pos= -1
            var su=-1
            var new_tweet=''
            var tweets = $('<ol>')

            result.tweet.forEach(function(option) {
              pos = option.search(/https/)

              if(pos>-1){
                sub = option.slice(pos)
                if(sub.search(' ')>-1){
                  su = sub.search(' ')
                  if(su>-1){
                    leng = pos+su
                    if(leng>-1){
                      href = option.slice(pos, leng)
                      blank = '_blank'
                      link ='<a href='+href+' target = '+blank+'>'+href+'</a>'
                      new_tweet = option.replace(href, link)
                    }
                  }
                }
                else{
                  href = sub
                  blank = '_blank'
                  link ='<a href='+href+' target = '+blank+'>'+href+'</a>'
                  // console.log(link)""
                  new_tweet = option.replace(href, link)
                  // console.log(href)
                }
              }
               
              if (new_tweet){
                option = new_tweet
              }
              tweets.append($('<li>').html(option))
              $('#tweet').html(tweets).show().parent().show()
            })
          }
          // .................................................................

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
