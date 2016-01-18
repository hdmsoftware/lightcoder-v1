'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Editors Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/editors',
      permissions: '*'
    }, {
      resources: '/api/editors/:editorId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/editors',
      permissions: ['get', 'post']
    }, {
      resources: '/api/editors/:editorId',
      permissions: ['get']
    },
    {
      resources: '/api/editors/compile',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/editors',
      permissions: ['get']
    }, {
      resources: '/api/editors/:editorId',
      permissions: ['get']
    },
    {
      resources: '/api/editors/compile',
      permissions: ['post']
    }]
  }]);
};

/**
 * Check If Editors Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an editor is being processed and the current user created it then allow any manipulation
  if (req.editor && req.user && req.editor.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
