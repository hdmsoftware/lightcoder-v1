'use strict';

// Configuring the Editors module
angular.module('editors').run(['Menus',
  function (Menus) {
    // Add the editors dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Editors',
      state: 'editors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'editors', {
      title: 'List Editors',
      state: 'editors.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'editors', {
      title: 'Create Editors',
      state: 'editors.create',
      roles: ['user']
    });
  }
]);
