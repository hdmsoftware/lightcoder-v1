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
  var smtpTransport = require('nodemailer-smtp-transport');

  var transporter = nodemailer.createTransport('smtps://hdizdarevic%40gmail.com:tropa12@smtp.gmail.com');

 
  var mailOptions = {
      to : 'haris@hdmsoftware.com',
      subject : req.body.from,
      text : req.body.message
  }

  console.log(mailOptions);

  transporter.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
      res.end("error");
      }else{
        console.log("Message sent: " + response.message);
      res.end("sent");
      }
  });


  console.log("in send contacts:" + req.body.from);
}
