'use strict';

/**
 * Module dependencies.
 */
var editorsPolicy = require('../policies/editors.server.policy'),
  editors = require('../controllers/editors.server.controller');

module.exports = function (app) {

  // Editors collection routes
  app.route('/api/editors').all(editorsPolicy.isAllowed)
    .get(editors.list)
    .post(editors.create);

  // Compile code route
  app.route('/api/editors/compile').all(editorsPolicy.isAllowed)
    .post(editors.compile); 
    
  // Single editor routes
  app.route('/api/editors/:editorId').all(editorsPolicy.isAllowed)
    .get(editors.read)
    .put(editors.update)
    .delete(editors.delete);


  // Finish by binding the editor middleware
 // app.param('editorId', editors.editorByID);

  //console.log(app._router.stack);
};
