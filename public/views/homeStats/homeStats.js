var homeStatsModule = angular.module('homeStatsModule', [
  'felinotweetsApp'
]);

homeStatsModule.controller('homeStatsController',
  function($scope, $filter, auth, stats) {

    // user feedback
    $scope.notError = true;
    $scope.success = false;
    $scope.selected = -1;

    // stats info
    $scope.stats = {};
    $scope.dataLoaded = [false,false,false,
                          false,false,false];

    // chart's info
    $scope.opt = [];
    $scope.topAccounts = 5;
    $scope.statTitle = ['Menciones por franja horaria',
                        'Tweets escritos por usuario por franja horaria',
                        'Porcentaje de tweets con contenido multimedia por franja horaria',
                        'Tweets con más retweets por franja horaria',
                        'Porcentaje de tweets con hashtags por franja horaria',
                        'Menciones totales a cada cuenta'];
    $scope.chartType = ['line', 'line', 'line', 'line','line','pie'];

    // chart #1 (last registered users)
    $scope.getMentionsByHour = function() {
      stats.getMentionsByHour(auth.currentUser()).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var stats = result.data.message;

          // obtains registered users stats
          var datasets = [];
          for(var i in stats.data) {

            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var a = Math.random();
            if (a < 0.5) a = 0.5;

            var dataset =
            {
              label: 'Menciones a @' + stats.data[i].name,
              borderColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              backgroundColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              data: stats.data[i].values
            };
            datasets.push(dataset);
          }
          $scope.stats[0] =
          {
            labels: stats.labels,
            datasets: datasets
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
          };
          $scope.dataLoaded[0] = true;
        }
      });
    };

    // chart #2 (hashtags per hour)
    $scope.getHashtagsByHour = function() {
      stats.getHashtagsByHour(auth.currentUser()).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var stats = result.data.message;

          // obtains registered users stats
          var datasets = [];
          for(var i in stats.data) {

            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var a = Math.random();
            if (a < 0.5) a = 0.5;

            var dataset =
            {
              label: 'Tweets con hashtags de @' + stats.data[i].name,
              borderColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              backgroundColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              data: stats.data[i].values
            };
            datasets.push(dataset);
          }

          $scope.stats[4] =
          {
            labels: stats.labels,
            datasets: datasets
          };
          // sets the options
          $scope.opt[4] = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero:true
                }
              }]
            }
          };
          $scope.dataLoaded[4] = true;
        }
      });
    };

    // chart #3 (multimedia per hour)
    $scope.getMultimediaByHour = function() {
      stats.getMultimediaByHour(auth.currentUser()).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var stats = result.data.message;

          // obtains registered users stats
          var datasets = [];
          for(var i in stats.data) {

            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var a = Math.random();
            if (a < 0.5) a = 0.5;

            var dataset =
            {
              label: 'Tweets multimedia de @' + stats.data[i].name,
              borderColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              backgroundColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              data: stats.data[i].values
            };
            datasets.push(dataset);
          }

          $scope.stats[2] =
          {
            labels: stats.labels,
            datasets: datasets
          };
          // sets the options
          $scope.opt[2] = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero:true
                }
              }]
            }
          };
          $scope.dataLoaded[2] = true;
        }
      });
    };

    // chart #4 (retweets per hour)
    $scope.getRetweetsByHour = function() {
      stats.getRetweetsByHour(auth.currentUser()).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var stats = result.data.message;

          // obtains registered users stats
          var datasets = [];
          for(var i in stats.data) {

            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var a = Math.random();
            if (a < 0.5) a = 0.5;

            var dataset =
            {
              label: 'Retweets por franja horaria a tweets de @' +
                  stats.data[i].name,
              borderColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              backgroundColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              data: stats.data[i].values
            };
            datasets.push(dataset);
          }

          $scope.stats[3] =
          {
            labels: stats.labels,
            datasets: datasets
          };
          // sets the options
          $scope.opt[3] = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero:true
                }
              }]
            }
          };
          $scope.dataLoaded[3] = true;
        }
      });
    };

    // chart #5 (tweets per hour)
    $scope.getTweetsByHour = function() {
      stats.getTweetsByHour(auth.currentUser()).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var stats = result.data.message;

          // obtains registered users stats
          var datasets = [];
          for(var i in stats.data) {

            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var a = Math.random();
            if (a < 0.5) a = 0.5;

            var dataset =
            {
              label: 'Tweets escritos por @' +
                  stats.data[i].name,
              borderColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              backgroundColor:'rgba(' + r +
                                ',' + g +
                                ',' + b +
                                ',' + a + ')',
              data: stats.data[i].values
            };
            datasets.push(dataset);
          }

          $scope.stats[1] =
          {
            labels: stats.labels,
            datasets: datasets
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
          };
          $scope.dataLoaded[1] = true;
        }
      });
    };

    // chart #3 (top 5 users with more tweets)
    $scope.getRankingMentions = function() {
      stats.getRankingMentions($scope.topAccounts, auth.currentUser()).
          then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          var ranking = result.data.message;

          // obtains access users stats
          $scope.stats[5] =
          {
              labels: ranking.labels,
              datasets: [{
                  label: 'Menciones totales a @',
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
          $scope.opt[5] = {
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
          };
          $scope.dataLoaded[5] = true;
        }
      });
    };

    $scope.showChart = function(index) {
      if ($scope.stats) {
        var ctx = document.getElementById('chart-' + index);
        var myChart = new Chart(ctx, {
          type: $scope.chartType[index],
          data: $scope.stats[index],
          options: $scope.opt[index]
        });
      }
    };

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    // Initializes controller
    $scope.getMentionsByHour();
    $scope.getHashtagsByHour();
    $scope.getMultimediaByHour();
    $scope.getRetweetsByHour();
    $scope.getTweetsByHour();
    $scope.getRankingMentions();
});
