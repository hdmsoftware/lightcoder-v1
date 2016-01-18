'use strict';

(function () {
  // Editors Controller Spec
  describe('Editors Controller Tests', function () {
    // Initialize global variables
    var EditorsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Editors,
      mockEditor;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Editors_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Editors = _Editors_;

      // create mock editor
      mockEditor = new Editors({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Editor about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Editors controller.
      EditorsController = $controller('EditorsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one editor object fetched from XHR', inject(function (Editors) {
      // Create a sample editors array that includes the new editor
      var sampleEditors = [mockEditor];

      // Set GET response
      $httpBackend.expectGET('api/editors').respond(sampleEditors);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.editors).toEqualData(sampleEditors);
    }));

    it('$scope.findOne() should create an array with one editor object fetched from XHR using a editorId URL parameter', inject(function (Editors) {
      // Set the URL parameter
      $stateParams.editorId = mockEditor._id;

      // Set GET response
      $httpBackend.expectGET(/api\/editors\/([0-9a-fA-F]{24})$/).respond(mockEditor);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.editor).toEqualData(mockEditor);
    }));

    describe('$scope.create()', function () {
      var sampleEditorPostData;

      beforeEach(function () {
        // Create a sample editor object
        sampleEditorPostData = new Editors({
          title: 'An Editor about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Editor about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Editors) {
        // Set POST response
        $httpBackend.expectPOST('api/editors', sampleEditorPostData).respond(mockEditor);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the editor was created
        expect($location.path.calls.mostRecent().args[0]).toBe('editors/' + mockEditor._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/editors', sampleEditorPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock editor in scope
        scope.editor = mockEditor;
      });

      it('should update a valid editor', inject(function (Editors) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/editors\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/editors/' + mockEditor._id);
      }));

      it('should set scope.error to error response message', inject(function (Editors) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/editors\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(editor)', function () {
      beforeEach(function () {
        // Create new editors array and include the editor
        scope.editors = [mockEditor, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/editors\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockEditor);
      });

      it('should send a DELETE request with a valid editorId and remove the editor from the scope', inject(function (Editors) {
        expect(scope.editors.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.editor = mockEditor;

        $httpBackend.expectDELETE(/api\/editors\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to editors', function () {
        expect($location.path).toHaveBeenCalledWith('editors');
      });
    });
  });
}());
