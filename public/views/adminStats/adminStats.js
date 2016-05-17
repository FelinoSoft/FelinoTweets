var adminStatsModule = angular.module('adminStatsModule', [
  'felinotweetsApp'
]);

loginModule.controller('adminStatsController',
  function($scope, $filter, auth, stats) {
    console.log("AdminStatsController inicializado");

    // user feedback
    $scope.notError = true;
    $scope.success = false;
    $scope.selected = -1;

    // user info
    $scope.stats = {};

    // chart's info
    $scope.tabsRegistered = ['Todos', '30 días', '15 días', '7 días'];
    $scope.daysRegistered = 15;
    $scope.labelsRegistered = [];
    $scope.dataRegistered = [];

    $scope.tabsAccess = ['Todos', '30 días', '15 días', '7 días'];
    $scope.daysAccess = 7;
    $scope.labelsAccess = [];
    $scope.dataAccess = [];

    $scope.labelsRanking = [];
    $scope.dataRanking = [];

    $scope.opt = [];

    $scope.statTitle = ['Estadísticas de registros (últimos ' + $scope.daysRegistered + ' días)',
                        'Estadísticas de accesos (últimos ' + $scope.daysAccess + ' días)',
                        'Estadísticas de tweets',
                        'Mapa de tweets'];
    $scope.chartType = ['line', 'line', 'pie', 'line'];

    // chart #1 (last registered users)
    $scope.getRegisterInfo = function() {
      stats.getRegistersByDate($scope.daysRegistered).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          $scope.lastUsersRegistered = result.data.message;

          // initializes data array
          for (var i = 0; i < $scope.daysRegistered; i++) {
            $scope.dataRegistered[i] = 0;
          }

          // generates the labels for past days
          for (var i = 0; i < $scope.daysRegistered; i++) {
            var d = new Date();
            var formatedDate = $filter('date')
              (d.setDate(d.getDate() - $scope.daysRegistered + i + 1), "MM-dd");
            $scope.labelsRegistered.push(formatedDate);
          }

          // generates the data for past days
          angular.forEach($scope.lastUsersRegistered, function(value, key) {
            var formatedDate = $filter('date')
              (value.registration_date, "MM-dd");

            // compares formatedDate with all past days
            angular.forEach($scope.labelsRegistered, function(labelValue, labelKey) {
              if (formatedDate == labelValue) {
                $scope.dataRegistered[labelKey] = $scope.dataRegistered[labelKey] + 1;
              }
            });
          });

          // filters an array to obtain unique values
          // $scope.labels = $scope.labels.reverse().filter(function (e, i, arr) {
          // return arr.indexOf(e, i+1) === -1;
          // }).reverse();

          // obtains registered users stats
          $scope.stats[0] =
          {
              labels: $scope.labelsRegistered,
              datasets: [
                {
                  label: 'Altas',
                  borderColor:'rgba(94,169,221,0.9)',
                  backgroundColor:'rgba(94,169,221,0.6)',
                  data: $scope.dataRegistered
                },
                {
                  label: 'Bajas',
                  borderColor:'rgba(255,0,0,0.9)',
                  backgroundColor:'rgba(255,0,0,0.6)',
                  data: $scope.dataRegistered
                }
              ]
          };

          // sets the options
          $scope.opt[0] = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
          }
        }
      });
    }


    // chart #2 (last access)
    $scope.getAccessInfo = function() {
      stats.getAccessByDate($scope.daysAccess).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          $scope.lastAccess = result.data.message;

          // initializes data array
          for (var i = 0; i < $scope.daysAccess; i++) {
            $scope.dataAccess[i] = 0;
          }

          // generates the labels for past days
          for (var i = 0; i < $scope.daysAccess; i++) {
            var d = new Date();
            var formatedDate = $filter('date')
              (d.setDate(d.getDate() - $scope.daysAccess + i + 1), "MM-dd");
            $scope.labelsAccess.push(formatedDate);
          }

          // generates the data for past days
          angular.forEach($scope.lastAccess, function(value, key) {
            var formatedDate = $filter('date')
              (value.last_access_date, "MM-dd");

            // compares formatedDate with all past days
            angular.forEach($scope.labelsAccess, function(labelValue, labelKey) {
              if (formatedDate == labelValue) {
                $scope.dataAccess[labelKey] = $scope.dataAccess[labelKey] + 1;
              }
            });
            $scope.activeUsers = $scope.lastAccess.length;
          });

          // obtains access users stats
          $scope.stats[1] =
          {
              labels: $scope.labelsAccess,
              datasets: [{
                  label: 'Accesos',
                  borderColor:'rgba(0,230,77,0.9)',
                  backgroundColor:'rgba(0,230,77,0.6)',
                  data: $scope.dataAccess
              }]
          };

          // sets the options
          $scope.opt[1] = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
          }
        }
      });
    }

    // chart #3 (top 5 users with more tweets)
    $scope.getRankingInfo = function() {
      stats.getRankingUsers().then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          $scope.rankingUsers = result.data.message;
          var numUsers = $scope.rankingUsers.length;

          console.log($scope.rankingUsers);
          console.log(numUsers);

          // initializes data array
          for (var i = 0; i < numUsers; i++) {
            $scope.dataRanking[i] = 0;
          }

          angular.forEach($scope.rankingUsers, function(value, key) {

            console.log(value);
            console.log(key);

            if (key < 5) {

              // sets the labels
              var labelUser = value.email;
              $scope.labelsRanking[key] = labelUser;

              // sets the data (n_tweets)
              var nTweets = value.n_tweets;
              $scope.dataRanking[key] = nTweets;
            }
          });

          // obtains access users stats
          $scope.stats[2] =
          {
              labels: $scope.labelsRanking,
              datasets: [{
                  label: 'nº tweets',
                  data: $scope.dataRanking,
                  borderColor:'rgba(94,169,221,0.9)',
                  backgroundColor:[
                    'rgba(94,169,221,0.6)',
                    'rgba(153,51,255,0.6)',
                    'rgba(255,26,26,0.6)',
                    'rgba(51,204,51,0.6)',
                    'rgba(255,102,0,0.6)',
                  ]
              }]
          };

          // sets the options
          $scope.opt[2] = {
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                  display: false
                }]
            }
          }
        }
      });
    }

    $scope.showChart = function(index) {
      if ($scope.stats) {

        console.log("CHARTS");
        
        var ctx = document.getElementById('chart-' + index);
        var myChart = new Chart(ctx, {
          type: $scope.chartType[index],
          data: $scope.stats[index],
          options: $scope.opt[index]
        });
      }
    }

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    // Initializes controller
    $scope.getRegisterInfo();
    $scope.getAccessInfo();
    $scope.getRankingInfo();
});
