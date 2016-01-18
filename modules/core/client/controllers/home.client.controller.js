'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.send = function (isValid) {

      $scope.error = null;

      if (!isValid) {
      	console.log("kme");
        $scope.$broadcast('show-errors-check-validity', 'contactForm');

        return false;
      }

      $http.post('/sendcontact', $scope.contact).success(function (response) {
        // If successful we assign the response to the global user model
        //$scope.authentication.user = response;

        // And redirect to the previous or home page
        //$state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        //$scope.error = response.message;
      });
    };
  }
]);
