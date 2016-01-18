'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Editor = mongoose.model('Editor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, editor;

/**
 * Editor routes tests
 */
describe('Editor CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new editor
    user.save(function () {
      editor = {
        title: 'Editor Title',
        content: 'Editor Content'
      };

      done();
    });
  });

  it('should be able to save an editor if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new editor
        agent.post('/api/editors')
          .send(editor)
          .expect(200)
          .end(function (editorSaveErr, editorSaveRes) {
            // Handle editor save error
            if (editorSaveErr) {
              return done(editorSaveErr);
            }

            // Get a list of editors
            agent.get('/api/editors')
              .end(function (editorsGetErr, editorsGetRes) {
                // Handle editor save error
                if (editorsGetErr) {
                  return done(editorsGetErr);
                }

                // Get editors list
                var editors = editorsGetRes.body;

                // Set assertions
                (editors[0].user._id).should.equal(userId);
                (editors[0].title).should.match('Editor Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an editor if not logged in', function (done) {
    agent.post('/api/editors')
      .send(editor)
      .expect(403)
      .end(function (editorSaveErr, editorSaveRes) {
        // Call the assertion callback
        done(editorSaveErr);
      });
  });

  it('should not be able to save an editor if no title is provided', function (done) {
    // Invalidate title field
    editor.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new editor
        agent.post('/api/editors')
          .send(editor)
          .expect(400)
          .end(function (editorSaveErr, editorSaveRes) {
            // Set message assertion
            (editorSaveRes.body.message).should.match('Title cannot be blank');

            // Handle editor save error
            done(editorSaveErr);
          });
      });
  });

  it('should be able to update an editor if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new editor
        agent.post('/api/editors')
          .send(editor)
          .expect(200)
          .end(function (editorSaveErr, editorSaveRes) {
            // Handle editor save error
            if (editorSaveErr) {
              return done(editorSaveErr);
            }

            // Update editor title
            editor.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing editor
            agent.put('/api/editors/' + editorSaveRes.body._id)
              .send(editor)
              .expect(200)
              .end(function (editorUpdateErr, editorUpdateRes) {
                // Handle editor update error
                if (editorUpdateErr) {
                  return done(editorUpdateErr);
                }

                // Set assertions
                (editorUpdateRes.body._id).should.equal(editorSaveRes.body._id);
                (editorUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of editors if not signed in', function (done) {
    // Create new editor model instance
    var editorObj = new Editor(editor);

    // Save the editor
    editorObj.save(function () {
      // Request editors
      request(app).get('/api/editors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single editor if not signed in', function (done) {
    // Create new editor model instance
    var editorObj = new Editor(editor);

    // Save the editor
    editorObj.save(function () {
      request(app).get('/api/editors/' + editorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', editor.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single editor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/editors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Editor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single editor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent editor
    request(app).get('/api/editors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No editor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an editor if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new editor
        agent.post('/api/editors')
          .send(editor)
          .expect(200)
          .end(function (editorSaveErr, editorSaveRes) {
            // Handle editor save error
            if (editorSaveErr) {
              return done(editorSaveErr);
            }

            // Delete an existing editor
            agent.delete('/api/editors/' + editorSaveRes.body._id)
              .send(editor)
              .expect(200)
              .end(function (editorDeleteErr, editorDeleteRes) {
                // Handle editor error error
                if (editorDeleteErr) {
                  return done(editorDeleteErr);
                }

                // Set assertions
                (editorDeleteRes.body._id).should.equal(editorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an editor if not signed in', function (done) {
    // Set editor user
    editor.user = user;

    // Create new editor model instance
    var editorObj = new Editor(editor);

    // Save the editor
    editorObj.save(function () {
      // Try deleting editor
      request(app).delete('/api/editors/' + editorObj._id)
        .expect(403)
        .end(function (editorDeleteErr, editorDeleteRes) {
          // Set message assertion
          (editorDeleteRes.body.message).should.match('User is not authorized');

          // Handle editor error error
          done(editorDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Editor.remove().exec(done);
    });
  });
});
