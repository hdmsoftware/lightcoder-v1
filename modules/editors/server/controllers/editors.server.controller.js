'use strict';

/**
 * Module dependencies.
 */
var path    = require('path'),
  mongoose  = require('mongoose'),
  Editor    = mongoose.model('Editor'),
  compilers = require(path.resolve('./modules/common/compilers.js')),
  sandbox   =  require(path.resolve('./modules/common/sandbox.js')),
  uuid      = require('node-uuid'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Get user entered code and run docker
 */
 exports.compile = function(req, res){

  //
    // extract user entered code and language id from request
    //
    var usercode = req.body.code;
    var languageid = req.body.language;


    var stdin     = req.body.stdin; // we might need this in the future for compiled programs

    console.log("stdin:" + stdin);

    //
    // folder in which the temporary folder will be saved.
    // generate a unique time-based guid id
    //
    var tempFolder = '/temp/' + uuid.v1();

    //
    // we need to know current working path
    ///
    var currentWorkingPath = path.resolve('./modules/common/');
   
    //
    // create a new sandbox object
    //
    var sandboxData = {
        usercode: usercode,
        languageid: languageid,
        tempFolder: tempFolder,
        currentWorkingPath: currentWorkingPath,
        compilerName :compilers.compilerArray[languageid][0],
        fileName :compilers.compilerArray[languageid][1],
        outputCommand:compilers.compilerArray[languageid][2],
        languageName :compilers.compilerArray[languageid][3],
        extraArguments: compilers.compilerArray[languageid][4],
        standardInput : stdin
    };

    var sandboxRunner = new sandbox(sandboxData);

    //
    // run docker and compile the code
    //
    sandboxRunner.run(function(err, data, errFileData) {

        if (err) {
           // do some hiding of internals with replacing "mountfolder"
           if ( !errFileData ){
            errFileData = "There was an error processing the request.";
           }

            errFileData.replace("/mountfolder/","");
            res.status(500).send("Compile time error:" + errFileData);

        } else {
            // do some hiding of internals with replacing "mountfolder" and
            // masaging vb.net output message
	    var temp = data.replace("/mountfolder/","");
	    if (languageid  === 9) //if vb.net
	    {
	        temp = temp.split(/\r?\n/)[3];
            }

            res.send({
                output: temp,
                err: err
            });
        }
    });

 };

/**
 * Create a editor
 */
exports.create = function (req, res) {
  var editor = new Editor(req.body);
  editor.user = req.user;

  editor.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(editor);
    }
  });
};

/**
 * Show the current editor
 */
exports.read = function (req, res) {
  res.json(req.editor);
};

/**
 * Update a editor
 */
exports.update = function (req, res) {
  var editor = req.editor;

  editor.title = req.body.title;
  editor.content = req.body.content;

  editor.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(editor);
    }
  });
};

/**
 * Delete an editor
 */
exports.delete = function (req, res) {
  var editor = req.editor;

  editor.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(editor);
    }
  });
};

/**
 * List of Editors
 */
exports.list = function (req, res) {
  Editor.find().sort('-created').populate('user', 'displayName').exec(function (err, editors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(editors);
    }
  });
};

/**
 * Editor middleware
 */
exports.editorByID = function (req, res, next, id) {

  console.log("Editor in editorByID");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Editor is invalid'
    });
  }

  Editor.findById(id).populate('user', 'displayName').exec(function (err, editor) {
    if (err) {
      return next(err);
    } else if (!editor) {
      return res.status(404).send({
        message: 'No editor with that identifier has been found'
      });
    }
    req.editor = editor;
    next();
  });
};
