'use strict';

// Setting up route
angular.module('courses').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('courses.list', {
        url: '',
        templateUrl: 'modules/courses/client/views/list-courses.client.view.html'
      })
      .state('courses.create', {
        url: '/create',
        templateUrl: 'modules/courses/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('courses.view', {
        url: '/:articleId',
        templateUrl: 'modules/courses/client/views/view-article.client.view.html'
      })
      .state('courses.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/courses/client/views/edit-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
