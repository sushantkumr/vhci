(function() {
  var app = angular.module('products', [])

  var updateState = function() {
    $.ajax({
      url: '/getStatus',
      method: 'GET',
      success: function(result) {
        console.log(result)
        var ref = $('#Refrigerator')
        var tr = $('<tr>')
        var td1 = $('<td>')
        var td2 = $('<td>')
        td1.html('temperature')
        td2.html(result.temperature)
        tr.append(td1)
        tr.append(td2)
        ref.html(tr)
      },
      error: function() {}
    })
  } 

  app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[')
      .endSymbol(']}')
  })

  app.controller('NavbarController', ['$rootScope', function($rootScope) {
    this.set = function(show) {
      $rootScope.$broadcast('setSubCard', show)
    }
  }])

  app.controller('VoiceFormController', [function() {
    this.record = function() {
      if(typeof webkitSpeechRecognition !== 'function') {
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
    this.submit = function() {
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
          $('#result').html(output_string).show()
          updateState()
          // console.log(output_string)
        },
        error: function() {}
      })
    }
  }])

  app.controller('DeviceController', ['$scope', function($scope) {
    $scope.subCard = 'operations'

    $scope.$on('setSubCard', function(event, arg) {
      $scope.setSubCard(arg)
    })

    $scope.isSubCard = function(subCard) {
      return $scope.subCard === subCard
    }

    $scope.setSubCard = function(subCard) {
      $scope.subCard = subCard
    }

    // API call for this to keep things in sync?
    $scope.devices = {
      'Refrigerator': {
        operations: [
          {intent: 'Set temperature', arguments: 'Target temperature'},
          {intent: 'Query temperature', arguments: 'None'},
          {intent: 'Query contents', arguments: 'Contents'},
        ]
      },
      'Television': {
        operations: [
          {intent: 'Set volume', arguments: 'Target volume'},
          {intent: 'Increase volume', arguments: 'Number'},
          {intent: 'Decrease volume', arguments: 'Number'},
          {intent: 'Mute', arguments: 'None'},
          {intent: 'Set channel', arguments: 'Target channel'},
          {intent: 'Next channel', arguments: 'None'},
          {intent: 'Previous channel', arguments: 'None'},
        ]
      },
      'Phone': {
        operations: [
          {intent: 'Call', arguments: 'Person'},
          {intent: 'Play song', arguments: 'Song'},
          {intent: 'Start application', arguments: 'Application name'},
          {intent: 'Silent mode', arguments: 'None'},
          {intent: 'Normal mode', arguments: 'None'},
          {intent: 'Accept call', arguments: 'None'},
          {intent: 'Reject call', arguments: 'None'},
        ]
      }
    }
  }])
})()
