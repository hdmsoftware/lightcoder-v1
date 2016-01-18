'use strict';

/**
 * Module dependencies.
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  // Single article routes
  app.route('/api/courses/:articleId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);

  // Finish by binding the article middleware
  app.param('articleId', courses.articleByID);
};
