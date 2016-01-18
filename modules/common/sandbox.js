//
// This is our main object that will be responsible for collecting
// information from user request and running docker container
//
var sandbox = function(sandboxData) {

	var exec = require('child_process').exec;
	var q = require('q');
	var fs = require('fs');
	var path = require('path');
	var constants   =  require(path.resolve('./modules/common/constants.js'));
    var sandboxError   =  require(path.resolve('./modules/common/sandboxerror.js'));
	

	var self = this;

	this.usercode = sandboxData.usercode;
	this.languageid = sandboxData.languageid;
	this.tempFolder = sandboxData.tempFolder;
	this.currentWorkingPath = sandboxData.currentWorkingPath;
	this.compilerName = sandboxData.compilerName;
	this.fileName = sandboxData.fileName;
	this.outputCommand = sandboxData.outputCommand;
	this.languageName = sandboxData.languageName;
	this.extraArguments = sandboxData.extraArguments;
	this.standardInput = sandboxData.standardInput;
	this.dockerImage = constants.dockerImage;

	this.fullPathToTemp = this.currentWorkingPath + this.tempFolder;

	this.timeoutValue = 20;

	//
	// check of docker image exists before we do anything further
	//
	function checkDockerImageExists() {

		console.log("checkDockerImageExists");

		var deferred = q.defer();

		var command = "docker images -q " + self.dockerImage;

		exec(command, function(error, stdout, stderr) {
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				//
				// if docker image found
				if (stdout) {
					deferred.resolve();
				} else // container not found
				{
					deferred.reject(sandboxError.errordockerimage);
				}
			}
		})

		return deferred.promise;
	}
	//
	// create user's temp directory where files will be saved
	//
	function createTempDirectory() {
		console.log("createTempDirectory");

		var deferred = q.defer();

		//
		// each user will have its own directory path where code will be saved
		// make that directory
		//
		exec("mkdir -p " +  self.fullPathToTemp, function(error) {
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				deferred.resolve();
			}
		})

		return deferred.promise;
	};

	//
	// copy script.sh file to the user's directory
	//
	function copyScriptExecutionFile() {
		console.log("copyScriptExecutionFile");


		var deferred = q.defer();

		var command = "cp " + self.currentWorkingPath + "/bashscripts/* " + self.fullPathToTemp;

		exec(command, function(error) {
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				deferred.resolve();
			}
		})

		return deferred.promise;
	};



	//
	// write user entered code to a file
	//
	function writeUserCodeToFile() {
		console.log("writeUserCodeToFile");

		var deferred = q.defer();

		var userFile = self.fullPathToTemp + "/" + self.fileName;

		fs.writeFile(userFile, self.usercode, function(error) {
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise;

	}

	//
	// set permissions on the file
	//
	function setPermissionsToFile() {
		console.log("setPermissionsToFile");

		var deferred = q.defer();

		//
		// set permissions on the user's file
		//
		var command = "chmod 777 \'" + self.fullPathToTemp + "/" + self.fileName + "\'";

		exec(command, function(error){
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				deferred.resolve();
			}
		})

		return deferred.promise;
	};

	//
	// write standard input to a file
	//
	function writeStdInputToFile() {
		console.log("writeStdInputToFile");

		var deferred = q.defer();

		var userStanardInputFile = self.fullPathToTemp + "/inputFile";

		fs.writeFile(userStanardInputFile, self.standardInput, function(error) {
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise;

	}

	//
	// main run method
	//
	function run(success) {

		checkDockerImageExists()
			.then(createTempDirectory)
			.then(copyScriptExecutionFile)
			.then(writeUserCodeToFile)
			.then(setPermissionsToFile)
			.then(writeStdInputToFile)
			.then(runDocker)
			.then(checkForCompleted)
			.then(function(compilationDetails) {
				console.log(compilationDetails);
				success(compilationDetails.error,
					compilationDetails.data,
					compilationDetails.compilationerrors)
			})
			.catch(function(error) {
				console.log(sandboxError.genericpromise + error);
				success(error, null);
			})
			.done();

	};


	//
	// run docker container
	//
	function runDocker() {
		console.log("runDocker");
		//
		// run docker command using docker timeout script and script.sh file
		//
		
		   dockerRunCommand = self.currentWorkingPath + '/dockertimeout.sh ' +  self.timeoutValue + 's' +
			' -i -t -v  "' + self.fullPathToTemp + '":/mountfolder ' + self.dockerImage +
			' /mountfolder/script.sh ' + self.compilerName + ' ' + self.fileName +
		    ' ' + self.outputCommand + ' ' + self.extraArguments;
		

		console.log("Command to execute:" + dockerRunCommand +
			" language id: " + self.languageid);

		var deferred = q.defer();
		//
		// execute the Docker
		//
		exec(dockerRunCommand, function(error, stdout, stderr) {
			if (error) {
				deferred.reject(error + new Error(error.stack || error));
			} else {
				deferred.resolve();
			}
		});

		return deferred.promise;



	}

	function checkForCompleted() {

		console.log("checkForCompleted");

		var timerCount = 0; //variable to enforce the timeout_value

		var deferred = q.defer();

		//
		// check for file named "completed" after 1 second interval
		//
		var intid = setInterval(function() {

			timerCount = timerCount + 1;

			fs.readFile(self.currentWorkingPath + self.tempFolder + '/completed', 'utf8', function(err, data) {

				//
				// if file is not available yet and the file interval is not yet up continue
				//
				if (err && timerCount < self.timeoutValue) {
					console.log(err);
					return;
				}
				//
				// if file is found simply display a message and proceed
				//
				else if (timerCount < self.timeoutValue) {

					//
					// check for any errors
					//
					fs.readFile(self.fullPathToTemp + '/errors', 'utf8', function(err2, compilationerrors) {
						if (!compilationerrors) compilationerrors = ""

						var lines = data.toString().split('*-COMPILEBOX::ENDOFOUTPUT-*');
						data = lines[0];
						var time = lines[1];

						deferred.resolve({
							error: compilationerrors.length > 0 ? new Error() : null,
							data: data,
							time: time,
							compilationerrors: compilationerrors
						});

						//success(null, data, time, compilationerrors)
					});
				}
				//
				// if time is up. Save an error message to the data variable
				//
				else {
					//
					// Since the time is up, we take the partial output and return it.
					//
					fs.readFile(self.fullPathToTemp + '/logfile.txt', 'utf8', function(err, data) {
						if (!data) data = "";
						data += "\nExecution Timed Out";

						fs.readFile(self.fullPathToTemp + '/errors', 'utf8', function(err2, compilationerrors) {
							if (!compilationerrors) compilationerrors = "";

							var lines = data.toString().split('*---*');
							data = lines[0];
							var time = lines[1];

							deferred.resolve({
								error: compilationerrors.length > 0 ? new Error() : null,
								data: data,
								time: time,
								compilationerrors: compilationerrors
							});

						});
					});

				}


				//
				// remove the temp user directory
				//
				// exec("rm -r " + self.fullPathToTemp, function(err, data) {
				// 	if (err) {
				// 		console.log(sandboxError.errorremovingtemp);

				// 		deferred.reject({
				// 				error: err,
				// 				data: null,
				// 				time: null,
				// 				compilationerrors: null
				// 		});

				// 	} else {
				// 		//console.log("Success..");
				// 	}
				// });


				clearInterval(intid);
			});
		}, 1000);


		return deferred.promise;
	}

	// 
	// this is our only public function
	//
	return {
		run: run
	}
};

module.exports = sandbox;
