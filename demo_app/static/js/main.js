
/* Constants, global variables and clock controllers
 */
var newCommand // Indicates whether a command is a continuation of the previous command or not
var oldResult // If the current command is a continuation, history will also be sent
var currentSession // The device that owns the current session
var isSessionActive // Whether or not a session is currently active
var timeout
var player // SoundCloud widget reference.

try {
  // Initializing SCloud object
  SC.initialize({
    client_id : SoundCloud.client_id
  })
}
catch (e) {
  console.log('SoundCloud could not be loaded. Not connected to the internet.')
}

$(document).ready(function() {
  // This will be executed when the page is loaded
  (function() {
    utils.clearSession() // Ensure that all variables are set to correct values
    setupRecognizer() // Setup the speech recognizer
  })()

  // Submits form using AJAX
  $('#command_form').submit(function(e) {
    e.preventDefault()

    // Read text in the form field and clear it
    var inputContent = $('input[name=command_text]').val()
    $('input[name=command_text]').val('')

    if (inputContent.search('reset session') !== -1) {
      utils.clearSession()
      isSessionActive = true
      var panel = utils.generateDiv()
      var message = 'Session has been reset'
      panel.find('.box').append($('<pre>').html(message))
      $('.holder').prepend(panel)
      return
    }

    var submit = function() {
      var data = {} // The object that will be sent to the server
      data.input = inputContent // The latest command that has been issued
      data.newCommand = newCommand
      data.currentSession = currentSession
      data.oldResult = JSON.stringify(oldResult)
      console.log('Submitting :', data)
      $.ajax({
        url: '/command',
        method: 'POST',
        data: data,
        success: function(result) {
          console.log('Received :', result)
          if (result.error === true) {
             oldResult = {}
             newCommand = true
          }

          // If current command has been executed completely
          if (result.final === true) {
            oldResult = {}
            newCommand = true
            // Show details on screen
            var panel = utils.generateDiv()
            var parsedResult = JSON.stringify(result.parsed, null, 2) // The JSON object that has been returned
            var parsed = $('<pre>').html(parsedResult)
            var message = $('<pre>').html(result.message)
            panel.find('.box').append(message)
            panel.find('.box').append(parsed)
            $('.holder').prepend(panel) // Add it to the webpage

            if (result.tweet) {
              var panel = utils.generateDiv()
              var message = $('<pre>').html('Tweets found:')
              var tweets = $('<ul>')
              result.tweet.forEach(function(tweet) {
                tweets.append($('<li>').html(tweet))
              })
              panel.find('.box').append(message)
              panel.find('.box').append($('<pre>').append(tweets))
              $('.holder').prepend(panel)
            }

            if (result.weather) {
              var panel = utils.generateDiv()
              var message = $('<pre>').html('Weather condition in ' + result.info[0] + ' as on ' + result.info[1])
              var weather = $('<ul>')
              // result.weather= result.weather[1:5]
              result.weather.forEach(function(option) {
                weather.append($('<li>').html(option))
              })
              panel.find('.box').append(message)
              panel.find('.box').append($('<pre>').append(weather))
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
              container.find('.box').append(iframe).removeClass('box')
              $('.holder').prepend(container)
              currentSession = 'tetris'
            }

            // If soundcloud
            if (result.parsed && result.parsed.device === 'soundcloud') {
              currentSession = 'soundcloud'
              soundCloudHandler(result)
            }

            // If totem
            if (result.parsed && result.parsed.device === 'totem') {
              currentSession = 'totem'
              if (result.parsed.intent === '--play' && result.duration) {
                timeout = setTimeout(function() {
                  utils.clearSession()
                }, result.duration)
              }
            }

            // If file explorer
            if (result.parsed && result.parsed.device === 'file_explorer') {
              currentSession = 'file_explorer'
              fileExplorerHandler(result)
            }

            // If weather
            if (result.parsed && result.parsed.device === 'forecast') {
              currentSession = 'forecast'
            }
          }

          // Needs confirmation or more information
          else if (result.final === false) {
            // Show details on screen
            var panel = utils.generateDiv()
            var parsedResult = JSON.stringify(result.parsed, null, 2) // The JSON object that has been returned
            var parsed = $('<pre>').html(parsedResult)
            var message = $('<pre>').html(result.message)
            panel.find('.box').append(message)

            oldResult = result
            newCommand = false
            if (result.options !== undefined) {
              var optionsPre = $('<pre>')
              var options = $('<ol>')
              result.options.forEach(function(option) {
                options.append($('<li>').html(option))
              })
              optionsPre.append(options)
              panel.find('.box').append(optionsPre)
            }

            // Handle cases where input is provided with no intent or arguments
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
            $('.holder').prepend(panel) // Add it to the webpage
          }
        },
      })
    }
    submit()
  })
})
