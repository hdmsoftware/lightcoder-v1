'use strict';

// Editors controller
angular.module('editors').controller('EditorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Editors','Languages','Codes','_',
  function ($scope, $stateParams, $location, Authentication, Editors, Languages, Codes, _) {
    $scope.authentication = Authentication;

    $scope.languages = Languages;
    $scope.selectedLanguage = $stateParams.language; 


    $scope.languageId = "";
    $scope.aceValue = 'Insert your code here, or select a language to use basic template.';

    angular.element(document).ready(function () {
    //    $scope.change($scope.selectedLanguage);
    });

    $scope.aceLoaded = function(_editor) {
        $scope.aceSession = _editor.getSession();
        var _session = _editor.getSession();
        _editor.$blockScrolling = Infinity;
        $scope.selectedLanguage = decodeURIComponent($scope.selectedLanguage);
        $scope.change($scope.selectedLanguage );
     };

    $scope.change = function(language){

      if(language){
        // find mode and set language default value for the code
        var result = _.some(Languages, function (entry) {
          if (entry.name === $scope.selectedLanguage)
          {
            $scope.aceSession.setMode('ace/mode/' + entry.mode); 
            $scope.languageId = entry.id;
          }
        });

        $scope.aceValue =  _.get(Codes, language );
      }
    };


     $scope.compile = function(){

       if($scope.selectedLanguage){

         $scope.message = "";
         
        var editor = new Editors({ 
          code: $scope.aceValue,
          language: $scope.languageId 
        });

       
        editor.$compileit(function (response) {
          $scope.result = response.output;
          //console.log(response.output);
        }, function (errorResponse) {
          //console.log("Error:" + errorResponse.data);
          $scope.result = errorResponse.data;
        });

       }
    };


    // Create new Editor
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'editorForm');

        return false;
      }

      // Create new Editor object
      var editor = new Editors({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      editor.$save(function (response) {
        $location.path('editors/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Editor
    $scope.remove = function (editor) {
      if (editor) {
        editor.$remove();

        for (var i in $scope.editors) {
          if ($scope.editors[i] === editor) {
            $scope.editors.splice(i, 1);
          }
        }
      } else {
        $scope.editor.$remove(function () {
          $location.path('editors');
        });
      }
    };

    // Update existing Editor
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'editorForm');

        return false;
      }

      var editor = $scope.editor;

      editor.$update(function () {
        $location.path('editors/' + editor._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Editors
    $scope.find = function () {
      $scope.editors = Editors.query();
    };

    // Find existing Editor
    $scope.findOne = function () {
      $scope.editor = Editors.get({
        editorId: $stateParams.editorId
      });
    };
  }
]);
