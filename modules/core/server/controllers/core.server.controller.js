'use strict';

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.sendContacts = function(req, res){
   var nodemailer = require('nodemailer');
   var sgTransport = require('nodemailer-sendgrid-transport');
   var options = {
	  auth: {
    		api_user: '',
    		api_key: ''
 	 }
	};

var client = nodemailer.createTransport(sgTransport(options));

var email = {
  from: req.body.from,
  to: 'haris@hdmsoftware.com',
  subject: 'Hello from LightCoder',
  text: req.body.message
};

client.sendMail(email, function(err, info){
    if (err ){
      console.log(err);
      res.send(err);
    }
    else {
      res.sendStatus(200);
      console.log('Message sent: ');
}
 
 
  console.log("in send contacts:" + req.body.from);
});
};
