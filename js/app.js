var bbhmbApp = angular.module('bbhmbApp', ['ionic', 'firebase']);

bbhmbApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

bbhmbApp.factory("Items", function($firebaseArray) {
  var itemsRef = new Firebase("https://beer-counter.firebaseio.com/items");
  return $firebaseArray(itemsRef);
});

bbhmbApp.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//beer-counter.firebaseio.com/users");
  return $firebaseAuth(usersRef);
});

bbhmbApp.controller("ListCtrl", function($scope, Items, Auth) {

  $scope.login = function() {
    Auth.$authWithOAuthRedirect("github").then(function(authData) {
      // User successfully logged in
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("github").then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
  };

  Auth.$onAuth(function(authData) {
    if (authData === null) {
      console.log("Não logou ainda");
    } else {
      console.log("Logou como", authData.uid);
    }
    $scope.authData = authData; // This will display the user's name in our view
  });

  $scope.items = Items;
  $scope.showFields = false;
  $scope.showItems = function() {
    $scope.beerWho = '';
    $scope.beerCount = '';
    $scope.showFields = true;
  }
  $scope.addItem = function(a, b) {
    a = a || $scope.beerWho
    b = b || $scope.beerCount
    $scope.items.$add({
      'who': a,
      'beers': b,
      'user': $scope.authData.uid
    });
  };
});
