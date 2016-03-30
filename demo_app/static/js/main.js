$(document).ready(function() {
  /* Constants, global variables and clock controllers
   */

  var CLOCK_INTERVAL = 1000 // Clock will be called every second (1000 ms)
  var SESSION_DURATION = 20 // Active for this long without any activity

  var newCommand // Will be sent to server
  var oldResult // Will be sent to server

  var sessionDuration // Time left before the session expires
  var currentSession // If a front end app wants to own the session it can tag itself

  var clearSession = function() {
    newCommand = true
    oldResult = {}
    sessionDuration = 0
    currentSession = 0
  }

  var clock = function() {
    if (sessionDuration > 0) {
      sessionDuration -= 1
      if (sessionDuration === 0) {
        clearSession()
        console.log('Session ended')
      }
    }
    else {
      sessionDuration = 0
    }
  }

  var interval = setInterval(clock, CLOCK_INTERVAL)


  /* Utils and front end controllers
   */

  var generateDiv = function() {
    var container = $('<div>').addClass('container').css('margin-top', '20px')
    var row = $('<div>').addClass('row')
    var col = $('<div>').addClass('col-xs-12')
    var box = $('<div>').addClass('box')
    col.append(box)
    row.append(col)
    container.append(row)
    return container
  }

  var tetrisHandler = function(inputContent) {
    var messageTetris = function(message) {
      var tetris = $('.tetris')[0]
      tetris.contentWindow.postMessage(message, '*');
    }

    var similar = function(value,array) {
      return array.indexOf(value)>-1
    }
      var gameCommands = {
                          'start': 32,
                          'stop': 27,
                          'left': 37,
                          'right': 39,
                          'rotate': 38,
                          'drop': 40,
                          'tetris': 32,
                          }
      var start = ["start","tart","stat"]
      var stop = ["stop","top","step","stoup"]
      var left = ["left","cleft","lift"]
      var right = ["right","wright","bright"]
      var rotate = ["rotate","rooted","routed"]
      var drop = ["drop","dropped"]
      var sets = [start,stop,left,right,rotate,drop]
      var sets_results = ["start","stop","left","right","rotate","drop"]
      var res = inputContent
      var result = res.split(" ")
      for(var i=0;i<result.length;i++)
        {
          for(var k=0;k<sets.length;k++)
            {
              a = similar(result[i],sets[k])
              if(a==true)
                {
                  res = sets_results[k]
                  break
                }
            }
          var commandIdx = Object.keys(gameCommands).indexOf(res)
          if (commandIdx === -1) {
            if (inputContent.search('quit session') !== -1 || inputContent.search('stop session') !== -1) {
              // The session itself is stopped
              sessionDuration = 0;
              currentSession = ''
              messageTetris(gameCommands['stop'])
            }
            if (inputContent.search('quit') !== -1) {
              // Exit only from the game, session is still active
              sessionDuration = SESSION_DURATION
              currentSession = ''
              messageTetris(gameCommands['stop'])
            }             
            console.log('Invalid command: ', inputContent === 'left')
            return
          }
          sessionDuration = 600
          messageTetris(gameCommands[res])
        }
  }


  /* Speech and server controllers
   */

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
      inputContent = inputContent.trim()

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

      console.log('session time left:', sessionDuration)
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
    clearSession()
    setupStreamer()
    if (typeof webkitSpeechRecognition === 'function') {
      streamer.start()
    }
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

    var inputContent = $('input[name=command_text]').val()
    if (currentSession === 'tetris') {
      tetrisHandler(inputContent)
      return
    }

    // recorder[0].stop()
    // streamer.stop()
    var submit = function() {
      var data = {}
      data.input = inputContent
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

            // If tetris
            if (result.parsed.device === 'tetris') {
              var container = generateDiv()
              var iframe = $('<iframe>')
                            .attr('src', 'tetris')
                            .attr('width', '100%')
                            .attr('height', '270px')
                            .addClass('tetris')
                            .append($('<div>').addClass('holder'))
              container.find('.box').append(iframe).removeClass('box')
              container.insertAfter('#voiceForm')
              currentSession = 'tetris'
              sessionDuration = 600 // Game will be active for ten minutes without any input
            }
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
