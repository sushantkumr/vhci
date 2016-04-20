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
    if (inputContent.search('session') === -1 && inputContent.search('fashion') === -1) {
      return false
    }
    if (inputContent.search('start') === -1 && inputContent.search('star') === -1) {
      return false
    }
    return true
  },

  isStopSession: function(inputContent) {
    if (inputContent.search('session') === -1 && inputContent.search('fashion') === -1) {
      return false
    }
    if (inputContent.search('stop') === -1 && inputContent.search('quit') === -1) {
      return false
    }
    return true
  },

  clearSession: function() {
    if (currentSession === 'soundcloud') {
      $('.soundcloud').remove()
    }
    else if (currentSession === 'tetris') {
      $('.tetris').remove()
    }
    else if (currentSession === 'totem') {
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
          input: 'yes'
        },
        method: 'POST'
      })
    }

    // else if (currentSession === 'file_explorer') {
    //   newCommand = false
    //   oldResult = {
    //     'commands': ['file explorer '],
    //     'final': True,
    //     'parsed': {
    //       'arguments': {},
    //       'device': 'file_explorer',
    //       'intent': '--reset'
    //     },
    //     'message': 'Path has been reset',
    //     'type': None,
    //     'path': ''
    //   }
    //   $.ajax({
    //     url: '/command',
    //     data: {
    //       newCommand: false,
    //       oldResult: JSON.stringify(oldResult),
    //     },
    //     method: 'POST'
    //   })      
    // }

    newCommand = true
    oldResult = {}
    currentSession = ''
    isSessionActive = false
  }
}
