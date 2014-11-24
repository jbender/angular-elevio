!((module, angular) ->
  "use strict"
  angular.module "ngElevio", ["elevio"]

  module.value "ElevioSettings", {}

  module.provider "ElevioService", ->
    createScript = ($document, callback) ->
      scriptTag = $document.createElement("script")
      scriptTag.type = "text/javascript"
      scriptTag.async = true
      scriptTag.src = "https://static.elev.io/js/v3.js"
      scriptTag.onreadystatechange = ->
        callback() if @readyState is "complete"

      scriptTag.onload = callback
      s = $document.getElementsByTagName("head")[0]
      s.appendChild scriptTag

    elevioBootstrap = ->
      Elevio   = -> Elevio.c arguments
      Elevio.q = []
      Elevio.c = (args) -> Elevio.q.push args
      Elevio

    @$get = [
      "$document"
      "$timeout"
      "$q"
      "$window"
      ($document, $timeout, $q, $window) ->
        init: (appId) ->
          deferred      = $q.defer()
          $window._elev =
            account_id: appId
          onScriptLoad  = (callback) ->
            $timeout ->
              # elevioApp = document.getElementById 'elevioWidget'
              # angular.bootstrap angular.element(elevioApp), ['elevioWidget']
              deferred.resolve $window._elev

          createScript $document[0], onScriptLoad

          deferred.promise
    ]
    return

  module.provider "Elevio", ->
    accountID = null

    @init = (_accountID) ->
      accountID = _accountID

    @$get = [
      "$window"
      "ElevioService"
      "ElevioSettings"
      ($window, ElevioService, ElevioSettings) ->
        _options  = {}
        _user     = {}
        elevioObj = false
        angular.extend _options, ElevioSettings
        invoke = ->
          return  unless elevioObj
          elevioObj.apply undefined, arguments
          return

        boot: (options) ->
          ElevioService.init(accountID)
          .then (elevio) ->
            options ?= _options
            angular.extend options,
              account_id: accountID

            # elevio "boot", options
            elevioObj = elevio

        setUser: (user) ->
          user ?= _user
          $window._elev.user = user
    ]
    return

  return
)(angular.module("elevio", []), angular)
