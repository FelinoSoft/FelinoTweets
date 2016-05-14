var adminStatsModule = angular.module('adminStatsModule', [
  'felinotweetsApp'
]);

loginModule.controller('adminStatsController',
  function($scope, auth) {
    console.log("AdminStatsController inicializado");

    // user feedback
    $scope.notError = true;
    $scope.success = false;
    $scope.selected = -1;

    // user info
    $scope.stats = {};
    $scope.stats[0] =
    {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3]
        }]
    };
    $scope.stats[1] =
    {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3]
        }]
    };

    $scope.stats[2] =
    {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3]
        }]
    };

    $scope.stats[3] =
    {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3]
        }]
    };

    $scope.showChart = function(index) {
      var ctx = document.getElementById("chart-" + index);
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: $scope.stats[index],
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
    }

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };
});
