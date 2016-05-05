var loginApp = angular.module('loginApp', []);
console.log('adios');

function mainController($scope, $http) {
    $scope.formData = {};
    console.log('hola');

    // when landing on the page, get all memos and show them
    $http.get('/memos/')
        .success(function(data) {
            $scope.memos = data.message;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMemo = function() {
        $http.post('/memos/', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.memos = data.message;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a memo after checking it
    $scope.deleteMemo = function(id) {
        $http.delete('/memos/' + id)
            .success(function(data) {
                $scope.memos = data.message;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}