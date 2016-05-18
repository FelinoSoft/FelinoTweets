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
    $scope.daysRegistered = 15;
    $scope.labelsRegistered = [];
    $scope.dataAltas = [];
    $scope.dataBajas = [];

    $scope.daysAccess = 7;
    $scope.labelsAccess = [];
    $scope.dataAccess = [];

    $scope.topUsers = 5;
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
          $scope.registerStats = result.data.message;

          // obtains the data and labels
          angular.forEach($scope.registerStats, function(value, key) {
            $scope.labelsRegistered.push(value.date);
            $scope.dataAltas.push(value.altas);
            $scope.dataBajas.push(value.bajas);
          });

          // obtains registered users stats
          $scope.stats[0] =
          {
              labels: $scope.labelsRegistered,
              datasets: [
                {
                  label: 'Altas',
                  borderColor:'rgba(94,169,221,0.9)',
                  backgroundColor:'rgba(94,169,221,0.6)',
                  data: $scope.dataAltas
                },
                {
                  label: 'Bajas',
                  borderColor:'rgba(255,0,0,0.9)',
                  backgroundColor:'rgba(255,0,0,0.6)',
                  data: $scope.dataBajas
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
      stats.getAccessByDate('acceso', $scope.daysAccess).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          $scope.lastAccess = result.data.message;
          $scope.activeUsers = $scope.lastAccess.length;

          // generates the data for past days
          angular.forEach($scope.lastAccess, function(value, key) {
            $scope.labelsAccess.push(value.date);
            $scope.dataAccess.push(value.events);
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
      stats.getRankingUsers($scope.topUsers).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          $scope.rankingUsers = result.data.message;

          angular.forEach($scope.rankingUsers, function(value, key) {
            $scope.labelsRanking.push(value.email);
            $scope.dataRanking.push(value.n_tweets);
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
