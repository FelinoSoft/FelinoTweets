var accountModule = angular.module('homeModule', [
  'felinotweetsApp'
]);

  accountModule.controller('homeController',
    function($scope,auth){
    console.log("homeController inicializado");

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    $scope.implemented = false;

    $scope.getAllDefaultPanels();
    console.log(panels);

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    $scope.getAllDefaultPanels = function(){
      $scope.panels[0] = getPanel("Home");
      $scope.panels[1] = getPanel("Mis tweets");
      $scope.panels[2] = getPanel("Programados");
      $scope.panels[3] = getPanel("Menciones");
    };

    $scope.getPanel = function(kind) {
      if(kind == "Home"){
        // Get data of timeline
        if(!implemented){
          // Mock data dpm
          var tweet1 = {"author":"Lolazo","text":"Me pica el huevo izquierdo",
            "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
            "nRetweets":"214", "nLikes":"12", "rted":false, "liked":false, "day":"7",
            "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
          };
          var tweet2 = {"author":"Lolazo","text":"Me pica el huevo derecho",
            "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
            "nRetweets":"214", "nLikes":"12", "rted":true, "liked":true, "day":"7",
            "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
          };
          return {"kind":kind, "tweets":[tweet1,tweet2]};
        }
      } else if(kind == "Mis tweets"){
        // Get data of own tweets
        if(!implemented){
          // Mock data dpm
          var tweet3 = {"author":"Lolazo","text":"Mae mia si me pica",
            "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
            "nRetweets":"214", "nLikes":"12", "rted":false, "liked":false, "day":"7",
            "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
          };
          var tweet4 = {"author":"Lolazo","text":"Me voy a rascar pero ya",
            "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
            "nRetweets":"214", "nLikes":"12", "rted":true, "liked":true, "day":"7",
            "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
          };
          return {"kind":kind, "tweets":[tweet3,tweet4]};
        }
      } else if(kind == "Programados"){
          // Get data of programmed tweets
          if(!implemented){
            // Mock data dpm
            var tweet5 = {"author":"Lolazo","text":"Ojo que me he rascado!",
              "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
              "nRetweets":"214", "nLikes":"12", "rted":false, "liked":false, "day":"7",
              "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
            };
            var tweet6 = {"author":"Lolazo","text":"Es coña",
              "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
              "nRetweets":"214", "nLikes":"12", "rted":true, "liked":true, "day":"7",
              "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
            };
            return {"kind":kind, "tweets":[tweet5,tweet6]};
          }
      } else if(kind == "Menciones") {
        // Get data of programmed tweets
        if(!implemented){
          // Mock data dpm
          var tweet7 = {"author":"Lolazo","text":"@Lolazo Uff que bien se siente",
            "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
            "nRetweets":"214", "nLikes":"12", "rted":false, "liked":false, "day":"7",
            "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
          };
          var tweet8 = {"author":"Lolazo","text":"@Lolazo Que me da algo lel",
            "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
            "nRetweets":"214", "nLikes":"12", "rted":true, "liked":true, "day":"7",
            "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
          };
          return {"kind":kind, "tweets":[tweet7,tweet8]};
        }
      }
    };
  });
