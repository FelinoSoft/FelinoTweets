var adminStatsModule = angular.module('adminStatsModule', [
  'felinotweetsApp'
]);

adminStatsModule.controller('adminStatsController',
  function($scope, $filter, auth, stats) {
    console.log("AdminStatsController inicializado");

    // user feedback
    $scope.notError = true;
    $scope.success = false;
    $scope.selected = -1;

    // user info
    $scope.activUsersDays = 7;
    $scope.stats = {};

    // chart's info
    $scope.daysRegistered = 15;
    $scope.daysAccess = 7;
    $scope.topUsers = 5;

    $scope.dataLoaded = [false, false, false, false];
    $scope.opt = [];

    $scope.statTitle = ['Estadísticas de registros (últimos ' + $scope.daysRegistered + ' días)',
                        'Estadísticas de accesos (últimos ' + $scope.daysAccess + ' días)',
                        'Ranking de usuarios con más tweets',
                        'Ranking de usuarios con más cuentas de twitter'];
    $scope.chartType = ['line', 'line', 'pie', 'pie'];

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
          var stats = result.data.message;

          // obtains registered users stats
          $scope.stats[0] =
          {
              labels: stats.labels,
              datasets: [
                {
                  label: 'Altas',
                  borderColor:'rgba(94,169,221,0.9)',
                  backgroundColor:'rgba(94,169,221,0.6)',
                  data: stats.data.altas
                },
                {
                  label: 'Bajas',
                  borderColor:'rgba(255,0,0,0.9)',
                  backgroundColor:'rgba(255,0,0,0.6)',
                  data: stats.data.bajas
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
          $scope.dataLoaded[0] = true;
        }
      });
    }


    // chart #2 (last access)
    $scope.getAccessInfo = function() {
      stats.getAccessByDate('acceso', $scope.daysAccess).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var stats = result.data.message;

          // obtains access users stats
          $scope.stats[1] =
          {
              labels: stats.labels,
              datasets: [{
                  label: 'Accesos',
                  borderColor:'rgba(0,230,77,0.9)',
                  backgroundColor:'rgba(0,230,77,0.6)',
                  data: stats.data.events
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
          $scope.dataLoaded[1] = true;
        }
      });
    }

    // chart #3 (top 5 users with more tweets)
    $scope.getRankingInfo = function() {
      stats.getRankingUsers($scope.topUsers).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var ranking = result.data.message;

          // obtains access users stats
          $scope.stats[2] =
          {
              labels: ranking.labels,
              datasets: [{
                  label: 'nº tweets',
                  data: ranking.data,
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
          $scope.dataLoaded[2] = true;
        }
      });
    }

    // chart #3 (top 5 users with more tweets)
    $scope.getRankingAccounts = function() {
      stats.getRankingAccounts($scope.topUsers).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var ranking = result.data.message;

          // obtains access users stats
          $scope.stats[3] =
          {
              labels: ranking.labels,
              datasets: [{
                  label: 'nº tweets',
                  data: ranking.data,
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
          $scope.opt[3] = {
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
          $scope.dataLoaded[3] = true;
        }
      });
    }

    $scope.getActiveUsers = function() {
      stats.getActiveUsers($scope.activUsersDays).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError =
                  "Error: no se ha podido recuperar a los usuarios activos."
          $scope.notError = false;
        }
        else {
          $scope.activeUsers = result.data.message;
        }
      });
    }

    $scope.showChart = function(index) {
      if ($scope.stats) {
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
    $scope.getRankingAccounts();
    $scope.getActiveUsers();
});
