
/*
	This file stores the compiler/interpretor details that are provided to DockerSandbox.sh	
	by the app.js
	The index is the key field, 
	First column contains the compiler/interpretor that will be used for translation
	Second column is the file name to use when storing the source code
	Third column is optional, it contains the command to invoke the compiled program, it is used only for compilers
	Fourth column is just the language name for display on console, for verbose error messages
	Fifth column is optional, it contains additional arguments/flags for compilers

	You can add more languages to this API by simply adding another 
	row in this file along with installing it in your
	Docker VM.
*/




exports.compilerArray= [ 
			 ["gmcs","file.cs","\'mono /mountfolder/file.exe\'","C#",""],
			 ["\'g++ -o /mountfolder/a.out\' ","file.cpp","/mountfolder/a.out","C/C++",""],
			 ["clojure","file.clj","","Clojure",""],
			 ["javac","file.java","\'./mountfolder/javaRunner.sh\'","Java",""],
			 ["\'go run\'","file.go","","Go",""],
			 ["php","file.php","","Php",""],
			 ["python","file.py","","Python",""],
			 ["ruby","file.rb","","Ruby",""],
			 ["scala","file.scala","","Scala",""],
			 ["\'vbnc -nologo -quiet\'","file.vb","\'mono /mountfolder/file.exe\'","VB.Net",""],
			 ["gcc ","file.m"," /mountfolder/a.out","Objective-C","\' -o /mountfolder/a.out -I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall -fconstant-string-class=NSConstantString\'"],
			 ["perl","file.pl","","Perl",""] ];





