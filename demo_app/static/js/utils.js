var utils = {

  generateDiv: function() {
    var container = $('<div>').addClass('container').css('margin-top', '20px')
    var row = $('<div>').addClass('row')
    var col = $('<div>').addClass('col-xs-12')
    var box = $('<div>').addClass('box')
    col.append(box)
    row.append(col)
    container.append(row)
    return container
  },

  isStartSession: function(inputContent) {
    // If session is not found AND interaction is not found
    if (inputContent.search('session') === -1 && inputContent.search('interaction') === -1) {
      return false
    }
    if (inputContent.search('start') === -1 && inputContent.search('begin') === -1) {
      return false
    }
    return true
  },

  isStopSession: function(inputContent) {
    if (inputContent.search('session') === -1 && inputContent.search('interaction') === -1) {
      return false
    }
    if (inputContent.search('stop') === -1 && inputContent.search('quit') === -1 && inputContent.search('terminate') === -1) {
      return false
    }
    return true
  },

  clearSession: function() {
    // Remove timeout, we're stopping totem now; don't have to do it in the future
    clearTimeout(timeout)
    if (currentSession === 'soundcloud') {
      $('.soundcloud').remove()
    }
    else if (currentSession === 'totem') {
      // Spoof a request pretending like quit has been confirmed
      newCommand = false
      oldResult = {
        'type': 'confirm',
        'final': false,
        'commands': ['quit totem'],
        'parsed': {
          'arguments': {},
          'device': 'totem',
          'intent': '--quit'
        }
      }
      $.ajax({
        url: '/command',
        data: {
          newCommand: false,
          oldResult: JSON.stringify(oldResult),
          input: 'yes',
          currentSession: currentSession
        },
        method: 'POST',
      })
    }

    newCommand = true
    oldResult = {}
    currentSession = ''
    isSessionActive = false
  }
}
