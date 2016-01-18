
# This will be our base image for running user code
# We need to install all compilers needed for executing it

FROM ubuntu:trusty
MAINTAINER Haris Dizdarevic

# Update the repository sources list
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu/ trusty-updates main universe multiverse restricted" >> /etc/apt/sources.list
RUN apt-get update
#RUN apt-get upgrade

#Install all the languages/compilers we are supporting.
#######################################################################################
RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y php5-cli
RUN apt-get install -y npm
RUN apt-get install -y golang-go	
RUN apt-get install -y nodejs
RUN apt-get install -y ruby
RUN apt-get install -y python
RUN apt-get install -y clojure1.4

#Install Mono for linux
#######################################################################################
RUN apt-get install -y mono-xsp2 mono-xsp2-base
RUN apt-get install -y mono-vbnc


#prepare for Java download
#######################################################################################
RUN apt-get install -y python-software-properties
RUN apt-get install -y software-properties-common
RUN apt-get install -y default-jre
RUN apt-get install -y default-jdk

# objective c compiler and libraries
#######################################################################################
RUN apt-get install -y gobjc
RUN apt-get install -y gnustep-devel &&  sed -i 's/#define BASE_NATIVE_OBJC_EXCEPTIONS     1/#define BASE_NATIVE_OBJC_EXCEPTIONS     0/g' /usr/include/GNUstep/GNUstepBase/GSConfig.h

# scala and perl
#######################################################################################
RUN apt-get install -y scala
RUN apt-get install -y perl

RUN apt-get install -y sudo
RUN apt-get install -y bc



