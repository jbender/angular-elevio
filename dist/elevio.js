!(function(module, angular) {
  "use strict";
  angular.module("ngElevio", ["elevio"]);
  module.value("ElevioSettings", {});
  module.provider("ElevioService", function() {
    var createScript, elevioBootstrap;
    createScript = function($document, callback) {
      var s, scriptTag;
      scriptTag = $document.createElement("script");
      scriptTag.type = "text/javascript";
      scriptTag.async = true;
      scriptTag.src = "https://static.elev.io/js/v3.js";
      scriptTag.onreadystatechange = function() {
        if (this.readyState === "complete") {
          return callback();
        }
      };
      scriptTag.onload = callback;
      s = $document.getElementsByTagName("head")[0];
      return s.appendChild(scriptTag);
    };
    elevioBootstrap = function() {
      var Elevio;
      Elevio = function() {
        return Elevio.c(arguments);
      };
      Elevio.q = [];
      Elevio.c = function(args) {
        return Elevio.q.push(args);
      };
      return Elevio;
    };
    this.$get = [
      "$document", "$timeout", "$q", "$window", function($document, $timeout, $q, $window) {
        return {
          init: function(appId) {
            var deferred, onScriptLoad;
            deferred = $q.defer();
            $window._elev = {
              account_id: appId
            };
            onScriptLoad = function(callback) {
              return $timeout(function() {
                return deferred.resolve($window._elev);
              });
            };
            createScript($document[0], onScriptLoad);
            return deferred.promise;
          }
        };
      }
    ];
  });
  module.provider("Elevio", function() {
    var accountID;
    accountID = null;
    this.init = function(_accountID) {
      return accountID = _accountID;
    };
    this.$get = [
      "$window", "ElevioService", "ElevioSettings", function($window, ElevioService, ElevioSettings) {
        var elevioObj, invoke, _options, _user;
        _options = {};
        _user = {};
        elevioObj = false;
        angular.extend(_options, ElevioSettings);
        invoke = function() {
          if (!elevioObj) {
            return;
          }
          elevioObj.apply(void 0, arguments);
        };
        return {
          boot: function(options) {
            return ElevioService.init(accountID).then(function(elevio) {
              if (options == null) {
                options = _options;
              }
              angular.extend(options, {
                account_id: accountID
              });
              return elevioObj = elevio;
            });
          },
          setUser: function(user) {
            if (user == null) {
              user = _user;
            }
            return $window._elev.user = user;
          }
        };
      }
    ];
  });
})(angular.module("elevio", []), angular);
