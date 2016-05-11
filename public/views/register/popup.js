var popupRegister = angular.module('popupRegister',[]);

popupRegister.controller('InsideCtrl', function ($scope) {
    $scope.dialogModel = {
        message : 'message from passed scope'
    };
});