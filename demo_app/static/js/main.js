$(document).ready(function() {
  /* Constants, global variables and clock controllers
   */

  var CLOCK_INTERVAL = 1000 // Clock will be called every second (1000 ms)
  var SESSION_DURATION = 300 // Active for this long without any activity

  var newCommand // Will be sent to server
  var oldResult // Will be sent to server

  var sessionDuration // Time left before the session expires
  var currentSession // If a front end app wants to own the session it can tag itself

  var player // SoundCloud widget reference. Docs can be found at https://developers.soundcloud.com/docs/api/html5-widget

  // Initializing SCloud object
  SC.initialize({
    client_id : 'c9908bc952a42fbf6b8e30c4b0ad6899'
  })

  var clearSession = function() {
    newCommand = true
    oldResult = {}
    sessionDuration = 0
    currentSession = ''
  };

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

  var speech_synthesis = function(message) {
    setTimeout(function(){
      var u = new SpeechSynthesisUtterance()
      u.text = message
      u.lang = 'en-IN'
      speechSynthesis.speak(u)
    }, 1000)
  }

  var tetrisHandler = function(inputContent) {
    var messageTetris = function(message) {
      var tetris = $('.tetris')[0]
      tetris.contentWindow.postMessage(message, '*')
    }

    var getCommands = function(inputContent) {
      var start = ['start', 'tart', 'stat']
      var stop = ['stop', 'top', 'step', 'stoup']
      var left = ['left', 'cleft', 'lift']
      var right = ['right', 'wright', 'bright', 'tight', 'try']
      var rotate = ['rotate', 'rooted', 'routed', 'rote', 'protect']
      var drop = ['drop', 'dropped']
      var sets = [start, stop, left, right, rotate, drop]
      var sets_results = ['start', 'stop', 'left', 'right', 'rotate', 'drop']

      var result = inputContent.split(' ')

      var commands = []
      outer: for(var i = 0; i < result.length; i++) {
        for(var k = 0; k < sets.length; k++) {
          if (sets[k].indexOf(result[i]) !== -1) {
            commands.push(sets_results[k])
            continue outer
          }
        }
      }
      return commands
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
    var commands = getCommands(inputContent)
    if (commands.length === 0) {
      if (inputContent.search('quit session') !== -1 || inputContent.search('stop session') !== -1) {
        // The session itself is stopped
        var panel = utils.generateDiv()
        var message = $('<pre>').html('Tetris closed and session terminated')
        panel.find('.box').append(message)
        $('.holder').prepend(panel)

        clearSession()
        messageTetris(gameCommands['stop'])
        $('.tetris').remove()
      }
      else if (inputContent.search('quit') !== -1) {
        // Exit only from the game, session is still active
        var panel = utils.generateDiv()
        var message = $('<pre>').html('Tetris closed')
        panel.find('.box').append(message)
        $('.holder').prepend(panel)

        sessionDuration = SESSION_DURATION
        currentSession = ''
        messageTetris(gameCommands['stop'])
        $('.tetris').remove()
      }
      return
    }
    sessionDuration = 600
    commands.forEach(function(command) {
      messageTetris(gameCommands[command])
    })
  }


  // Handles SoundCloud specific operations
  var soundCloudHandler = function(result) {

    // Creating iframe in order to load the widget
    var iframeGenerator = function() {
      var container = utils.generateDiv()
      var iframe = $('<iframe>')
                    .attr('src','https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundlcoud.com%2Ftracks%2F1848538&show_artwork=true') // Source of iframe has a link to a default song as an empty widget cannot be loaded
                    .attr('width', '100%')
                    .attr('height', '150px')
                    .addClass('soundcloud')
                    .append($('<div>').addClass('holder'))
      container.find('.box').append(iframe).removeClass('box')
      $('.holder').prepend(container)
    }

    // Handles loading the SCloud widget and playing the selected song.
    if (result.parsed.intent === '--play-song') {
      iframeGenerator()

      // Creating a widget using the iframe classname 'soundcloud'
      player = SC.Widget(document.querySelector('.soundcloud'))

      // Loads the selected song
      player.load(result.parsed.arguments.name.uri, {auto_play: true})

      // Register an asynchronous function that will be called when the song is over
      player.bind(SC.Widget.Events.FINISH, function() {
        console.log("Song finished")
        var panel = utils.generateDiv()
        var message = $('<pre>').html('Soundcloud closed and session terminated')
        panel.find('.box').append(message)
        $('.holder').prepend(panel)
        $('.soundcloud').remove() // Removing the SoundCloud iframe
        clearSession()
      });
    }

    // Lists the songs matching the given name
    else if (result.parsed.intent === '--list') {

      // 'get' retrieves the list of songs from SoundCloud
      SC.get('/tracks', {
          q: result.parsed.arguments.name,
          license: 'cc-by-sa',
          limit: 10
      })
      .then(function(tracks) { // Tracks contains a list of songs retrieved from SCloud
        result.parsed.intent = '--play-song' //Mimic a request to server for continuation of selection of song from a list
        newCommand = false

         // Creating an array of dictionaries from an array of tracks which stores the uri and song name
        var options = tracks.map(function(track) {
          return {
            'uri': track.uri,
            'optionName': track.title
          }
        })
        result = {
          'message': 'Which song do you want to play?',
          'options': options,
          'option-name': 'name',
          'option-type': 'arguments',
          'type': 'option',
          'final': false,
          'error': false,
          'parsed': result.parsed
        }
        oldResult = result
        var panel = utils.generateDiv()
        var message = $('<pre>').html(result.message)
        var parsed = $('<pre>').html(parsed)
        panel.find('.box').append(message)
        $('.holder').prepend(panel)
        if (result.options !== undefined) {
          var optionsPre = $('<pre>')
          var options = $('<ol>')
          result.options.forEach(function(option) {
            options.append($('<li>').html(option.optionName))
          })
          optionsPre.append(options)
          panel.find('.box').append(optionsPre)
        }
        $('.holder').prepend(container)
      })
    }

    else if (result.parsed.intent === '--pause') {
      console.log("Paused SC")
      player.pause()
    }

    // Plays the song only if it has been paused
    else if (result.parsed.intent === '--play') {
      console.log("Playing SC")
      player.play()
    }

    // Toggles the widget
    else if (result.parsed.intent === '--play-pause') {
      console.log("Toggle SC")
      player.toggle()
    }

    else if (result.parsed.intent === '--quit') {
      console.log("Quiting SC")
      $('.soundcloud').remove() // Removing the SoundCloud iframe
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
        var panel = utils.generateDiv()
        var message = $('<pre>').html('Session started')
        panel.find('.box').append(message)
        $('.holder').prepend(panel)
        console.log('Session started')
        return
      }


      var isStopSession = inputContent.search('stop session')
      if (isStopSession !== -1) {
        sessionDuration = 0
        var panel = utils.generateDiv()
        var message = $('<pre>').html('Session stopped')
        panel.find('.box').append(message)
        $('.holder').prepend(panel)
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
    $('input[name=command_text]').val("soundcloud list in the end")
    $('#main-submit').click()
  })


   // Submits form using AJAX
  $('#main-submit').click(function(e) {
    e.preventDefault()

    var inputContent = $('input[name=command_text]').val()

    // All front end apps should have their code before the 'quit' check
    if (currentSession === 'tetris') {
      tetrisHandler(inputContent)
      return
    }

    if (inputContent === 'quit session' || inputContent === 'quit') {
      clearSession()
      var panel = utils.generateDiv()
      return
    }

    var submit = function() {
      console.log(inputContent)
      var data = {}
      data.input = inputContent
      data.newCommand = newCommand // Global variable
      data.oldResult = JSON.stringify(oldResult)
      console.log('submit:', data)
      $.ajax({
        url: '/command',
        method: 'POST',
        data: data,
        success: function(result) {
          console.log('success:', result)
          if (result.error === true) {
            // Handle error
             oldResult = {}
             newCommand = true
            // return
           }
          if (result.final === true) { // Current command has been executed completely, start new session
            oldResult = {}
            newCommand = true
            var parsed = JSON.stringify(result.parsed, null, 2)
            var panel = utils.generateDiv()
            var parsed = $('<pre>').html(parsed)
            var message = $('<pre>').html(result.message)
            panel.find('.box').append(message)
            panel.find('.box').append(parsed)
            $('.holder').prepend(panel)

            if (result.tweet) {
              var panel = utils.generateDiv()
              var message = $('<pre>').html('Tweets found:')
              var tweets = $('<ul>')
              result.tweet.forEach(function(tweet) {
                tweets.append($('<li>').html(tweet))
              })
              panel.find('.box').append(message)
              panel.find('.box').append(tweets)
              $('.holder').prepend(panel)
            }

            if (result.weather) {
              var panel = utils.generateDiv()
              var message = $('<pre>').html('Weather condition in '+result.info[0] +' as on ' +result.info[1] )
              var weather = $('<ul>')
              // result.weather= result.weather[1:5]
              result.weather.forEach(function(option) {
                weather.append($('<li>').html(option))
              })
              panel.find('.box').append(message)
              panel.find('.box').append(weather)
              $('.holder').prepend(panel)
            }

            // If tetris
            if (result.parsed && result.parsed.device === 'tetris') {
              var container = utils.generateDiv()
              var iframe = $('<iframe>')
                            .attr('src', 'tetris')
                            .attr('width', '100%')
                            .attr('height', '270px')
                            .addClass('tetris')
                            .append($('<div>').addClass('holder'))
              container.find('.box').append(iframe).removeClass('box')
              // container.insertAfter('#voiceForm')
              $('.holder').prepend(container)
              currentSession = 'tetris'
              sessionDuration = 600 // Game will be active for ten minutes without any input
            }

            // If soundcloud
            if (result.parsed && result.parsed.device === 'soundcloud') {
              currentSession = 'soundcloud'
              soundCloudHandler(result)
              sessionDuration = SESSION_DURATION
            }
          }
          // // the below code is only for twitter delete after the interaction is made proper
          // if (result.final === 'twitter_False') {
          //   var parsed = JSON.stringify(result.parsed, null, 2)
          //   oldResult = {}
          //   newCommand = true
          //   $('#result').html(parsed).show().parent().show()
          //   $('#message').html(result.message)
          //   if (result.options !== undefined) {
          //     var options = $('<ol>')
          //     result.options.forEach(function(option) {
          //       options.append($('<li>').html(option))
          //     })
          //     $('#options').html(options)
          //     $('#tweet').hide()
          //   }
          // }

          else if (result.final === false) { // Needs confirmation or more information
            var parsed = JSON.stringify(result.parsed, null, 2)
            oldResult = result
            newCommand = false
            var panel = utils.generateDiv()
            var message = $('<pre>').html(result.message)
            var parsed = $('<pre>').html(parsed)
            panel.find('.box').append(message)
            $('.holder').prepend(panel)
            if (result.options !== undefined) {
              var optionsPre = $('<pre>')
              var options = $('<ol>')
              result.options.forEach(function(option) {
                options.append($('<li>').html(option))
              })
              optionsPre.append(options)
              panel.find('.box').append(optionsPre)
            }
            // to handle when input provided with no intent or arguments
            if(result.type === 'continue') {
              var optionsPre = $('<pre>')
              var messages= $('<ol>')
              result.example.forEach(function(option) {
                messages.append($('<li>').html(option))
              })
              optionsPre.append(messages)
              panel.find('.box').append(optionsPre)
            }
            panel.find('.box').append(parsed)
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
