var accountModule = angular.module('homeModule', [
  'felinotweetsApp'
]);

  accountModule.controller('homeController',
    function($scope,auth,twitter){
    console.log("homeController inicializado");

    $scope.implemented = false;

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    $scope.getAccountData = function(kind) {
      if(kind == "ElPutoAmo"){
        // Get data of timeline
        if(!$scope.implemented){
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
          return {"user":kind, "desc":"Bla ble bli blo blu","imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg","tweets":[tweet1,tweet2]};
        }
      } else if(kind == "SrFelino"){
        // Get data of own tweets
        if(!$scope.implemented){
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
          return {"user":kind, "desc":"Bla ble bli blo blu","imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg","tweets":[tweet3,tweet4]};
        }
      } else if(kind == "LaMarquesa"){
          // Get data of programmed tweets
          if(!$scope.implemented){
            // Mock data dpm
            var tweet5 = {"author":"ElPutoAmo","text":"Ojo que me he rascado!",
              "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
              "nRetweets":"214", "nLikes":"12", "rted":false, "liked":false, "day":"7",
              "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
            };
            var tweet6 = {"author":"LaMarquesa","text":"Es coña",
              "imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg",
              "nRetweets":"214", "nLikes":"12", "rted":false, "liked":true, "day":"7",
              "month":"Feb", "year":"1994", "tweetLink":"http://www.google.es"
            };
            return {"user":kind, "desc":"Ojala fuera como Jaime","imgLink":"https://pbs.twimg.com/profile_images/721419863609208832/3aBTZgMZ_400x400.jpg","tweets":[tweet5,tweet6]};
          }
      }
    };

    $scope.getAccountPanels = function(accounts){
      if(!$scope.implemented){
        // Mock data
        accounts = ["ElPutoAmo", "SrFelino", "LaMarquesa"];
      }

      $scope.panels = [];

      for (i = 0; i < accounts.length; i++) {
        $scope.panels[i] = $scope.getAccountData(accounts[i]);
      }
    };

    $scope.isSameUserAndAuthor = function(user, author){
      return user == author;
    };

    $scope.RThasToShow = function(user, author, rted, type){
      if(user != author){
        // User can click on RT
        if(type == 1 && !rted){
          return true;
        } else if(type == 1 && rted){
          return false;
        } else if(type == 2 && !rted){
          return false;
        } else {
          return true;
        }
      } else{
        return false;
      }
    };

    $scope.getAccountPanels("lol");

    $scope.twitterAuth = function(){
      console.log("He entrado en twitterAuth. Esternocleidomastoideo");
      twitter.twitterAuth();
    };

    /*
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
    };*/
  });
