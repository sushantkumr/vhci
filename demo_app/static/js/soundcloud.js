// Handles SoundCloud specific operations
// Docs can be found at https://developers.soundcloud.com/docs/api/html5-widget
var soundCloudHandler = function(result) {
  // Creates an iframe in order to load the widget
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
      utils.clearSession()
    })
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
