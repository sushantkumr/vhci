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
    if (inputContent.search('quit') !== -1 || inputContent.search('stop session') !== -1) {
      var panel = utils.generateDiv()
      var message = $('<pre>').html('Tetris closed and session terminated')
      panel.find('.box').append(message)
      $('.holder').prepend(panel)

      utils.clearSession()
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
