'use strict';

// Setting up route
angular.module('editors').config(['$stateProvider',
  function ($stateProvider) {
    // Editors state routing
    $stateProvider
      .state('editors', {
        abstract: true,
        url: '/editors',
        template: '<ui-view/>'
      })
      .state('editors.main', {
        url: '/:language',
        templateUrl: 'modules/editors/client/views/main-editors.client.view.html'
      })
      .state('editors.create', {
        url: '/create',
        templateUrl: 'modules/editors/client/views/create-editor.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('editors.view', {
        url: '/:editorId',
        templateUrl: 'modules/editors/client/views/view-editor.client.view.html'
      })
      .state('editors.edit', {
        url: '/:editorId/edit',
        templateUrl: 'modules/editors/client/views/edit-editor.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
