#!/bin/bash

#	- This is the main script that is used to compile/interpret the source code
#	- The script takes 3 arguments
#		1. The compiler that is to compile the source file.
#		2. The source file that is to be compiled/interpreted
#		3. Additional argument only needed for compilers, to execute the object code
#	

compiler=$1
file=$2
output=$3
addtionalArg=$4

exec  1> $"/mountfolder/logfile.txt"
exec  2> $"/mountfolder/errors"
#3>&1 4>&2 >

START=$(date +%s.%2N)
#Branch 1
if [ "$output" = "" ]; then
    $compiler /mountfolder/$file -< $"/mountfolder/inputFile" #| tee /mountfolder/output.txt
#Branch 2
else
	#In case of compile errors, redirect them to a file
        $compiler /mountfolder/$file $addtionalArg #&> /mountfolder/errors.txt
	#Branch 2a
	if [ $? -eq 0 ];	then
		$output -< $"/mountfolder/inputFile" #| tee /mountfolder/output.txt    
	#Branch 2b
	else
	    echo "Compilation Failed"
	    #if compilation fails, display the output file	
	    #cat /mountfolder/errors.txt
	fi
fi



END=$(date +%s.%2N)
runtime=$(echo "$END - $START" | bc)


echo "*-COMPILEBOX::ENDOFOUTPUT-*" $runtime 

mv /mountfolder/logfile.txt /mountfolder/completed

